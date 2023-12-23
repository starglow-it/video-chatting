import {
  ConnectedSocket,
  MessageBody,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Socket } from 'socket.io';

// gateways
import { BaseGateway } from './base.gateway';

// types
import {
  MeetingAccessStatusEnum,
  MeetingRole,
  ResponseSumType,
} from 'shared-types';

// services
import { MeetingsService } from '../modules/meetings/meetings.service';
import { UsersService } from '../modules/users/users.service';
import { CoreService } from '../services/core/core.service';

// dtos
import { UpdateUserRequestDTO } from '../dtos/requests/users/update-user.dto';
import { userSerialization } from '../dtos/response/common-user.dto';
import { RemoveUserRequestDTO } from '../dtos/requests/users/remove-user.dto';
import { meetingSerialization } from '../dtos/response/common-meeting.dto';

// helpers
import {
  ITransactionSession,
  withTransaction,
} from '../helpers/mongo/withTransaction';

// const
import {
  MeetingEmitEvents,
  UserEmitEvents,
} from '../const/socket-events/emitters';
import { UsersSubscribeEvents } from '../const/socket-events/subscribers';
import { MeetingUserDocument } from '../schemas/meeting-user.schema';
import { UserActionInMeeting } from '../types';
import { subscribeWsError, throwWsError, wsError } from '../utils/ws/wsError';
import { wsResult } from '../utils/ws/wsResult';
import { Roles } from '../utils/decorators/role.decorator';
import { UsersComponent } from '../modules/users/users.component';
import { MeetingNativeErrorEnum } from 'shared-const';
import { WsEvent } from '../utils/decorators/wsEvent.decorator';
@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class UsersGateway extends BaseGateway {
  constructor(
    private meetingsService: MeetingsService,
    private usersService: UsersService,
    private coreService: CoreService,
    private readonly usersComponent: UsersComponent,
    @InjectConnection() private connection: Connection,
  ) {
    super();
  }

  private async handleUpdateUsersTemplateVideoContainer({
    userTemplateId,
    meetingUserId,
    data,
    session,
  }: {
    userTemplateId: string;
    meetingUserId: string;
    data: Partial<MeetingUserDocument>;
    session: ITransactionSession;
  }) {
    const usersTemplate = await this.coreService.findMeetingTemplateById({
      id: userTemplateId,
    });

    const updateUser = await this.usersService.findOne({
      query: {
        _id: meetingUserId,
      },
      session,
    });

    const updateUsersPosistion = usersTemplate.usersPosition;
    const updateUsersSize = usersTemplate.usersSize;

    const index = usersTemplate.indexUsers.indexOf(meetingUserId);
    throwWsError(index <= -1, MeetingNativeErrorEnum.USER_NOT_FOUND);

    if (data?.userPosition) {
      updateUser.userPosition = data.userPosition;

      updateUsersPosistion[index] = data.userPosition;
    }

    if (data?.userSize) {
      updateUser.userSize = data.userSize;
      updateUsersSize[index] = data.userSize;
    }

    updateUser.save();

    this.coreService.updateUserTemplate({
      templateId: userTemplateId,
      userId: meetingUserId,
      data: {
        usersPosition: updateUsersPosistion,
        usersSize: updateUsersSize,
      },
    });
  }

  @WsEvent(UsersSubscribeEvents.OnUpdateUser)
  async updateUser(
    @MessageBody() message: UpdateUserRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(this.connection, async (session) => {
      subscribeWsError(socket);
      const user = await this.usersComponent.findOneAndUpdate({
        query: message.id ? { _id: message.id } : { socketId: socket.id },
        data: message,
        session,
      });

      const meeting = await this.meetingsService.findById({
        id: user.meeting._id,
        session,
      });

      await this.handleUpdateUsersTemplateVideoContainer({
        userTemplateId: meeting.templateId,
        meetingUserId: user.id.toString(),
        data: {
          userPosition: message?.userPosition,
          userSize: message?.userSize,
        },
        session,
      });

      await meeting.populate('users');

      const plainUser = userSerialization(user);

      const plainUsers = userSerialization(meeting.users);

      this.emitToRoom(`meeting:${user.meeting}`, UserEmitEvents.UpdateUsers, {
        users: plainUsers.map((user) => ({
          ...user,
          ...(message.userSize &&
            message.id == user.id && { userSize: message.userSize }),
          ...(message.userPosition &&
            message.id == user.id && { userPosition: message.userPosition }),
        })),
      });

      return wsResult({
        user: {
          ...plainUser,
          userPosition: {
            ...plainUser.userPosition,
            ...(message.userSize && { userSize: message?.userSize }),
          },
        },
      });
    });
  }

  @Roles([MeetingRole.Host])
  @WsEvent(UsersSubscribeEvents.OnRemoveUser)
  async removeUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: RemoveUserRequestDTO,
  ): Promise<ResponseSumType<void>> {
    return withTransaction(this.connection, async (session) => {
      subscribeWsError(socket);
      const user = await this.usersComponent.findById({
        id: message.id,
        session,
      });

      const meeting = await this.usersComponent.findMeetingFromPopulateUser(
        user,
      );

      const updateData = {
        sharingUserId: user.meeting.sharingUserId,
        hostUserId: user.meeting.hostUserId,
      };

      if (user.meeting.sharingUserId === user.id) {
        updateData.sharingUserId = null;
      }

      if (user.meeting.hostUserId === user.id) {
        updateData.hostUserId = null;
      }

      const userTemplate = await this.coreService.findMeetingTemplateById({
        id: meeting.templateId,
      });

      const u = await this.usersService.updateVideoContainer({
        userTemplate,
        userId: user._id.toString(),
        event: UserActionInMeeting.Leave,
      });

      throwWsError(!u, MeetingNativeErrorEnum.USER_HAS_BEEN_DELETED);

      await this.usersComponent.findOneAndUpdate({
        query: {
          _id: message.id,
        },
        data: {
          accessStatus: MeetingAccessStatusEnum.Left,
        },
        session,
      });

      const meetingUpdated = await this.meetingsService.updateMeetingById({
        id: user.meeting._id,
        data: updateData,
        session,
      });

      await meetingUpdated.populate('users');
      const plainMeeting = meetingSerialization(meetingUpdated);

      const userSocket = await this.getSocket(
        `meeting:${meetingUpdated._id}`,
        user.socketId,
      );

      userSocket.leave(`meeting:${meetingUpdated._id}`);

      this.emitToRoom(
        `meeting:${meetingUpdated._id}`,
        MeetingEmitEvents.UpdateMeeting,
        {
          meeting: plainMeeting,
        },
      );

      this.emitToRoom(
        `meeting:${user.meeting._id}`,
        UserEmitEvents.RemoveUsers,
        {
          users: [user._id],
        },
      );

      this.emitToSocketId(user.socketId, UserEmitEvents.KickUsers);
      return wsResult();
    });
  }
}
