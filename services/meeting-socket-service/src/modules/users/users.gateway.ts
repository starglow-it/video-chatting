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
  IUserTemplate,
  MeetingAccessStatusEnum,
  MeetingSwtichRoleStatus,
  MeetingRole,
  RequestSwitchRoleAction,
  ResponseSumType,
} from 'shared-types';

// services
import { MeetingsService } from '../meetings/meetings.service';
import { UsersService } from './users.service';
import { CoreService } from '../../services/core/core.service';
import { MeetingTimeService } from '../meeting-time/meeting-time.service';
import { TasksService } from '../tasks/tasks.service';

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
import { UsersSubscribeEvents } from '../../const/socket-events/subscribers';
import { MeetingUserDocument } from '../../schemas/meeting-user.schema';
import { UserActionInMeeting } from '../../types';
import { wsError } from '../../utils/ws/wsError';
import { SwtichRoleRequestDto } from '../../dtos/requests/users/request-switch-role.dto';
import { wsResult } from '../../utils/ws/wsResult';
import { AnswerSwitchRoleRequestDto } from '../../dtos/requests/users/answer-switch-role.dto';


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
          return wsError(client, {
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
        return wsError(client, err);
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
          return wsError(client, {
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
        return wsError(client, err);
      }
    });
  }

  @SubscribeMessage(UsersSubscribeEvents.OnRequestRoleByHost)
  async toggleInviteParticipant(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: SwtichRoleRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      const { action, meetingId, meetingUserId } = msg;
      try {
        const meeting = await this.meetingsService.findById(meetingId, session);
        if (!meeting) {
          return wsError(socket, {
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
          return wsError(socket, {
            message: 'Host not found',
          });
        }

        if (host.socketId !== socket.id && host.socketId === meetingUserId) {
          return wsError(socket, {
            message: 'User not have permission',
          });
        }

        const switchRoleStatus =
          action === RequestSwitchRoleAction.Request
            ? {
                from: MeetingSwtichRoleStatus.NoRequest,
                to: MeetingSwtichRoleStatus.HostRequest,
              }
            : {
                from: MeetingSwtichRoleStatus.HostRequest,
                to: MeetingSwtichRoleStatus.NoRequest,
              };

        const mU = await this.usersService.findOneAndUpdate(
          {
            meetingRole: MeetingRole.Lurker,
            accessStatus: MeetingAccessStatusEnum.InMeeting,
            switchRoleStatus: switchRoleStatus.from,
            _id: msg.meetingUserId,
          },
          {
            switchRoleStatus: switchRoleStatus.to,
          },
          session,
        );
        if (!mU) {
          return wsError(socket, {
            message: 'Invalid meeting user updated',
          });
        }

        await meeting.populate(['users']);

        const plainMeeting = meetingSerialization(meeting);
        const plainUsers = userSerialization(meeting.users);
        const plainUser = userSerialization(mU);

        this.emitToSocketId(plainUser.socketId, UserEmitEvents.UpdateUser, {
          user: plainUser,
          meeting: plainMeeting,
        });

        return wsResult({
          meeting: plainMeeting,
          users: plainUsers,
        });
      } catch (err) {
        return wsError(socket, err);
      }
    });
  }

  @SubscribeMessage(UsersSubscribeEvents.OnAnswerRequestByLurker)
  async answerToParticipantInvitation(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: AnswerSwitchRoleRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const mU = await this.usersService.findOneAndUpdate(
          {
            socketId: socket.id,
            switchRoleStatus: MeetingSwtichRoleStatus.HostRequest,
          },
          {
            switchRoleStatus: MeetingSwtichRoleStatus.NoRequest,
            ...(msg.action === AnswerSwitchRoleAction.Accept && {
              meetingRole: MeetingRole.Participant,
            }),
          },
          session,
        );
        if (!mU) {
          return wsError(socket, {
            message: 'No meeting user found',
          });
        }

        await mU.populate(['meeting']);

        if (!mU.meeting) {
          return wsError(socket, {
            message: 'No meeitng found',
          });
        }
        await mU.meeting.populate(['users']);

        const host = await this.usersService.findOne({
          query: {
            _id: mU.meeting.hostUserId,
          },
          session,
        });

        if (!host) {
          return wsError(socket, {
            message: 'Host not found',
          });
        }

        const plainMeeting = meetingSerialization(mU.meeting);
        const plainUser = userSerialization(mU);
        const plainUsers = userSerialization(mU.meeting.users);
        this.emitToSocketId(host.socketId, UserEmitEvents.UpdateUsers, {
          users: plainUsers,
        });
        return wsResult({
          meeting: plainMeeting,
          user: plainUser,
        });
      } catch (err) {
        return wsError(socket, err);
      }
    });
  }
}
