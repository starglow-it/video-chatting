import { plainToInstance } from 'class-transformer';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Socket } from 'socket.io';

// gateways
import { BaseGateway } from '../../gateway/base.gateway';

// types
import {
  AnswerSwitchRoleAction,
  MeetingAccessStatusEnum,
  MeetingRole,
  ResponseSumType,
} from 'shared-types';

// services
import { MeetingsService } from '../meetings/meetings.service';
import { UsersService } from './users.service';
import { CoreService } from '../../services/core/core.service';

// dtos
import { UpdateUserRequestDTO } from '../../dtos/requests/users/update-user.dto';
import {
  CommonUserDTO,
  userSerialization,
} from '../../dtos/response/common-user.dto';
import { RemoveUserRequestDTO } from '../../dtos/requests/users/remove-user.dto';
import { meetingSerialization } from '../../dtos/response/common-meeting.dto';

// helpers
import {
  ITransactionSession,
  withTransaction,
} from '../../helpers/mongo/withTransaction';

// const
import {
  MeetingEmitEvents,
  UserEmitEvents,
} from '../../const/socket-events/emitters';
import { LurkerSubscribeEvents, UsersSubscribeEvents } from '../../const/socket-events/subscribers';
import { MeetingUserDocument } from '../../schemas/meeting-user.schema';
import { UserActionInMeeting } from '../../types';
import { wsError } from '../../utils/ws/wsError';
import { SwitchRoleByHostRequestDto } from '../../dtos/requests/users/request-switch-role-by-host.dto';
import { wsResult } from '../../utils/ws/wsResult';
import { AnswerSwitchRoleByLurkerRequestDto } from '../../dtos/requests/users/answer-switch-role-by-lurker.dto';
import { LurkerEmitEvents } from '../../const/socket-events/emitters/lurker';
import { SwitchRoleByLurkerRequestDto } from '../../dtos/requests/users/request-switch-role-by-lurker.dto';
import { MeetingDocument } from '../../schemas/meeting.schema';
import { ObjectId } from '../../utils/objectId';
import { AnswerSwitchRoleByHostRequestDto } from '../../dtos/requests/users/answer-switch-role-by-host.dto';

type TRequestSwitchRoleParams = {
  meetingUser: MeetingUserDocument;
  socketEmitterId: string;
  meeting: MeetingDocument;
};

type TAnswerSwtichRoleParams = {
  action: AnswerSwitchRoleAction;
} & TRequestSwitchRoleParams;

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
    if (!(index + 1)) {
      return wsError(null, {
        message: 'Meeting user not found',
      });
    }

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

  @SubscribeMessage(UsersSubscribeEvents.OnUpdateUser)
  async updateUser(
    @MessageBody() message: UpdateUserRequestDTO,
    @ConnectedSocket() client: Socket,
  ): Promise<ResponseSumType<{ user: CommonUserDTO }>> {
    return withTransaction(this.connection, async (session) => {
      try {
        const user = await this.usersService.findOneAndUpdate(
          message.id ? { _id: message.id } : { socketId: client.id },
          message,
          session,
        );

        if (!user) {
          return wsError(client.id, {
            message: 'Meeting user not found',
          });
        }

        const meeting = await this.meetingsService.findById(
          user.meeting._id,
          session,
        );

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

        const plainUser = plainToInstance(CommonUserDTO, user, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        const plainUsers = plainToInstance(CommonUserDTO, meeting.users, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

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
      } catch (err) {
        return wsError(client.id, err);
      }
    });
  }

  @SubscribeMessage(UsersSubscribeEvents.OnRemoveUser)
  async removeUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: RemoveUserRequestDTO,
  ): Promise<ResponseSumType<void>> {
    return withTransaction(this.connection, async (session) => {
      try {
        console.log('Kick user event', {
          message,
          ctx: client.id,
        });

        const user = await this.usersService.findById(message.id, session);

        if (!user) {
          return wsError(client.id, {
            message: 'Meeting user not found',
          });
        }

        await user.populate('meeting');

        if (user.meeting) {
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

          await this.usersService.findOneAndUpdate(
            {
              _id: message.id,
            },
            {
              accessStatus: MeetingAccessStatusEnum.Left,
            },
            session,
          );

          const meeting = await this.meetingsService.updateMeetingById(
            user.meeting._id,
            updateData,
            session,
          );
          await meeting.populate(['users']);
          const plainMeeting = meetingSerialization(meeting);

          this.emitToRoom(
            `meeting:${meeting._id}`,
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

          const userTemplate = await this.coreService.findMeetingTemplateById({
            id: meeting.templateId,
          });

          this.emitToSocketId(user.socketId, UserEmitEvents.KickUsers);
          await this.usersService.updateIndexUsers({
            userTemplate,
            user,
            session,
            event: UserActionInMeeting.Leave,
          });
        }
      } catch (err) {
        return wsError(client.id, err);
      }
    });
  }

  async sendSwtichRoleRequest({
    meetingUser,
    meeting,
    socketEmitterId,
  }: TRequestSwitchRoleParams) {
    const plainMeeting = meetingSerialization(meeting);
    const plainUsers = userSerialization(meeting.users);
    const plainUser = userSerialization(meetingUser);

    this.emitToSocketId(socketEmitterId, LurkerEmitEvents.RequestSwitchRole, {
      user: plainUser,
      meeting: plainMeeting,
    });

    return wsResult({
      meeting: plainMeeting,
      users: plainUsers,
    });
  }

  @SubscribeMessage(LurkerSubscribeEvents.OnRequestRoleByLurker)
  async requestSwitchRoleByLurker(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: SwitchRoleByLurkerRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      const { meetingId } = msg;
      try {
        const meetingUser = await this.usersService.findOne({
          query: {
            socketId: socket.id,
            meetingRole: MeetingRole.Lurker,
          },
          session,
        });

        if (!meetingUser) {
          return wsError(socket.id, {
            message: 'User not found',
          });
        }

        const meeting = await this.meetingsService.findById(meetingId, session);
        if (!meeting) {
          return wsError(socket.id, {
            message: 'No meeting found',
          });
        }

        const host = await this.usersService.findOne({
          query: {
            _id: meeting.hostUserId,
          },
          session,
        });

        if (!host) {
          return wsError(socket.id, {
            message: 'Host not found',
          });
        }

        return await this.sendSwtichRoleRequest({
          meetingUser,
          meeting,
          socketEmitterId: host.socketId,
        });
      } catch (err) {
        return wsError(socket.id, err);
      }
    });
  }

  @SubscribeMessage(LurkerSubscribeEvents.OnRequestRoleByHost)
  async requestSwitchRoleByHost(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: SwitchRoleByHostRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      const { meetingId, meetingUserId } = msg;
      try {
        const meetingUser = await this.usersService.findOne({
          query: {
            _id: new ObjectId(meetingUserId),
            meetingRole: MeetingRole.Lurker,
          },
          session,
        });

        if (!meetingUser) {
          return wsError(socket.id, {
            message: 'User not found',
          });
        }

        const meeting = await this.meetingsService.findById(meetingId, session);
        if (!meeting) {
          return wsError(socket.id, {
            message: 'No meeting found',
          });
        }

        return await this.sendSwtichRoleRequest({
          meeting,
          meetingUser,
          socketEmitterId: meetingUser.socketId,
        });
      } catch (err) {
        return wsError(socket.id, err);
      }
    });
  }

  async answerSwitchRoleRequest({
    meeting,
    meetingUser,
    socketEmitterId,
    action,
  }: TAnswerSwtichRoleParams) {
    const plainMeeting = meetingSerialization(meeting);
    const plainUser = userSerialization(meetingUser);
    const plainUsers = userSerialization(meeting.users);
    this.emitToSocketId(socketEmitterId, LurkerEmitEvents.AnswerSwitchRole, {
      meeting: plainMeeting,
      users: plainUsers,
      action,
    });
    return wsResult({
      meeting: plainMeeting,
      user: plainUser,
    });
  }

  @SubscribeMessage(LurkerSubscribeEvents.OnAnswerRequestByHost)
  async answerSwitchRoleByHost(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { action, meetingUserId }: AnswerSwitchRoleByHostRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const meetingUser = await this.usersService.findOneAndUpdate(
          {
            _id: new ObjectId(meetingUserId),
            meetingRole: MeetingRole.Lurker,
          },
          {
            ...(action === AnswerSwitchRoleAction.Accept && {
              meetingRole: MeetingRole.Participant,
            }),
          },
          session,
        );
        if (!meetingUser) {
          return wsError(socket.id, {
            message: 'No meeting user found',
          });
        }

        await meetingUser.populate(['meeting']);

        const meeting = meetingUser.meeting;

        if (!meeting) {
          return wsError(socket.id, {
            message: 'No meeting found',
          });
        }

        return await this.answerSwitchRoleRequest({
          meeting,
          meetingUser,
          action,
          socketEmitterId: meetingUser.socketId,
        });
      } catch (err) {
        return wsError(socket.id, err);
      }
    });
  }

  @SubscribeMessage(LurkerSubscribeEvents.OnAnswerRequestByLurker)
  async answerSwitchRoleByLurker(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { action }: AnswerSwitchRoleByLurkerRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const meetingUser = await this.usersService.findOneAndUpdate(
          {
            socketId: socket.id,
            meetingRole: MeetingRole.Lurker,
          },
          {
            ...(action === AnswerSwitchRoleAction.Accept && {
              meetingRole: MeetingRole.Participant,
            }),
          },
          session,
        );
        if (!meetingUser) {
          return wsError(socket.id, {
            message: 'No meeting user found',
          });
        }

        await meetingUser.populate(['meeting']);

        const meeting = meetingUser.meeting;

        if (!meeting) {
          return wsError(socket.id, {
            message: 'No meeting found',
          });
        }

        const host = await this.usersService.findOne({
          query: {
            _id: meeting.hostUserId,
          },
          session,
        });

        if (!host) {
          return wsError(socket.id, {
            message: 'Host not found',
          });
        }

        await meeting.populate(['users']);

        return await this.answerSwitchRoleRequest({
          meeting,
          meetingUser,
          action,
          socketEmitterId: host.socketId,
        });
      } catch (err) {
        return wsError(socket.id, err);
      }
    });
  }
}
