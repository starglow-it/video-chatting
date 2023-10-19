import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { Socket } from 'socket.io';

import { BaseGateway } from '../../gateway/base.gateway';

import { MeetingsService } from './meetings.service';
import { UsersService } from '../users/users.service';
import { TasksService } from '../tasks/tasks.service';
import { CoreService } from '../../services/core/core.service';

import {
  IUserTemplate,
  KickUserReasons,
  MeetingAccessStatusEnum,
  MeetingAvatarStatus,
  MeetingRole,
  MeetingSoundsEnum,
  PlanKeys,
  ResponseSumType,
  TimeoutTypesEnum,
} from 'shared-types';

import { StartMeetingRequestDTO } from '../../dtos/requests/start-meeting.dto';
import { JoinMeetingRequestDTO } from '../../dtos/requests/join-meeting.dto';
import {
  CommonUserDTO,
  userSerialization,
} from '../../dtos/response/common-user.dto';
import {
  CommonMeetingDTO,
  meetingSerialization,
} from '../../dtos/response/common-meeting.dto';
import { EnterMeetingRequestDTO } from '../../dtos/requests/enter-meeting.dto';
import { MeetingAccessAnswerRequestDTO } from '../../dtos/requests/answer-access-meeting.dto';
import { LeaveMeetingRequestDTO } from '../../dtos/requests/leave-meeting.dto';
import { EndMeetingRequestDTO } from '../../dtos/requests/end-meeting.dto';
import { UpdateMeetingRequestDTO } from '../../dtos/requests/update-meeting.dto';

import { getTimeoutTimestamp } from '../../utils/getTimeoutTimestamp';
import {
  ITransactionSession,
  withTransaction,
} from '../../helpers/mongo/withTransaction';
import { MeetingTimeService } from '../meeting-time/meeting-time.service';
import {
  MeetingEmitEvents,
  UserEmitEvents,
  VideoChatEmitEvents,
} from '../../const/socket-events/emitters';
import {
  MeetingSubscribeEvents,
  UsersSubscribeEvents,
  VideoChatSubscribeEvents,
} from '../../const/socket-events/subscribers';
import { MeetingsCommonService } from './meetings.common';
import {
  MeetingUser,
  MeetingUserDocument,
} from '../../schemas/meeting-user.schema';
import { MeetingDocument } from '../../schemas/meeting.schema';
import { wsError } from '../../utils/ws/wsError';
import { ReconnectDto } from '../../dtos/requests/recconnect.dto';
import { notifyParticipantsMeetingInfo } from '../../providers/socket.provider';
import { LurkerJoinMeetingDto } from '../../dtos/requests/lurker-join-meeting.dto';
import { wsResult } from '../../utils/ws/wsResult';
import { ObjectId } from '../../utils/objectId';
import { MeetingChatsService } from '../meeting-chats/meeting-chats.service';
import { ChangeHostDto } from '../../dtos/requests/change-host.dto';
import { SendOfferRequestDto } from '../../dtos/requests/send-offer.dto';
import { SendAnswerOfferRequestDto } from '../../dtos/requests/send-answer-offer.dto';
import { SendIceCandidateRequestDto } from '../../dtos/requests/send-candidate.dto';
import { SendDevicesPermissionsRequestDto } from '../../dtos/requests/send-devices-permissions.dto';
import { UserActionInMeeting } from '../../types';
import { PassAuth } from 'src/utils/decorators/passAuth.decorator';
import { Roles } from 'src/utils/decorators/role.decorator';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class MeetingsGateway
  extends BaseGateway
  implements OnGatewayDisconnect
{
  private readonly logger = new Logger(MeetingsGateway.name);
  constructor(
    private meetingsService: MeetingsService,
    private meetingChatsService: MeetingChatsService,
    private usersService: UsersService,
    private coreService: CoreService,
    private taskService: TasksService,
    private meetingHostTimeService: MeetingTimeService,
    private meetingsCommonService: MeetingsCommonService,
    @InjectConnection() private connection: Connection,
  ) {
    super();
  }

  async setTimeoutFinishMeeting(meeting: MeetingDocument) {
    const meetingId = meeting._id.toString() as string;
    const endTimestamp = getTimeoutTimestamp({
      type: TimeoutTypesEnum.Minutes,
      value: 15,
    });

    const meetingEndTime = (meeting.endsAt || Date.now()) - Date.now();

    this.taskService.deleteTimeout({
      name: `meeting:finish:${meetingId}`,
    });

    this.taskService.addTimeout({
      name: `meeting:finish:${meetingId}`,
      ts: meetingEndTime > endTimestamp ? endTimestamp : meetingEndTime,
      callback: this.endMeeting.bind(this, {
        meetingId,
      }),
    });
  }

  async handleOutRoom({
    meeting,
    session,
    user,
    userTemplate,
  }: {
    session: ITransactionSession;
    client: Socket;
    user: MeetingUserDocument;
    meeting: MeetingDocument;
    userTemplate: IUserTemplate;
  }) {
    await meeting.populate(['owner', 'users']);

    const userId = user?._id.toString();

    const commonTemplate =
      await this.coreService.findCommonTemplateByTemplateId({
        templateId: userTemplate.templateId,
      });

    const timeToAdd = Date.now() - user.joinedAt;

    if (meeting?.sharingUserId === userId) {
      meeting.sharingUserId = null;

      await meeting.save({ session: session.session });
    }

    const meetingUsers = await this.usersService.findUsers(
      {
        meeting: meeting.id,
        accessStatus: {
          $in: [
            MeetingAccessStatusEnum.InMeeting,
            MeetingAccessStatusEnum.Disconnected,
          ],
        },
      },
      session,
    );

    const activeParticipants = meetingUsers.length;

    await this.coreService.updateRoomRatingStatistic({
      templateId: commonTemplate.id,
      userId: commonTemplate?.author,
      ratingKey: 'minutes',
      value: timeToAdd,
    });

    const meetingId = meeting._id.toString();
    const isMeetingHost = meeting.hostUserId._id.toString() === userId;

    await this.meetingsCommonService.handleUserLoggedInDisconnect({
      isMeetingHost,
      meetingId,
      session,
      timeToAdd,
      user,
    });

    if (activeParticipants === 0) {
      await this.meetingsCommonService.handleClearMeetingData({
        userId: meeting.owner._id,
        templateId: userTemplate.id,
        instanceId: userTemplate.meetingInstance.instanceId,
        meetingId,
        session,
      });
      return;
    }

    if (!isMeetingHost) return;
    await this.setTimeoutFinishMeeting(meeting);
  }

  private async getLastOldMessageInMeeting(
    meetingId: string,
    session: ITransactionSession,
  ) {
    const [msg] = await this.meetingChatsService.findMany({
      query: {
        meeting: meetingId,
      },
      options: {
        limit: 1,
        sort: {
          _id: -1,
        },
      },
      session,
    });
    return msg;
  }

  async handleDisconnect(client: Socket) {
    try {
      console.log('disconnect', client.id);

      return withTransaction(this.connection, async (session) => {
        const user = await this.usersService.findOne({
          query: { socketId: client.id },
          session,
        });
        if (!user) {
          return wsError(client.id, {
            message: 'No user found',
          });
        }

        await user.populate('meeting');
        if (!user.meeting) {
          return wsError(client.id, {
            message: 'Meeting not found',
          });
        }

        const userId = user._id.toString();
        let meeting = user.meeting;
        const isOwner = meeting.owner._id.toString() === userId;

        const userTemplate = await this.coreService.findMeetingTemplateById({
          id: meeting.templateId,
        });

        if (!userTemplate) {
          return wsError(client.id, {
            message: 'User template not found',
          });
        }

        let accessStatusUpdate = MeetingAccessStatusEnum.Left;
        let isDisconnectStatus = false;
        if (user.accessStatus === MeetingAccessStatusEnum.InMeeting) {
          accessStatusUpdate = MeetingAccessStatusEnum.Disconnected;
        }

        const updateData = {
          accessStatus: accessStatusUpdate,
        };

        if (user.meetingRole !== MeetingRole.Lurker) {
          const u = await this.usersService.updateSizeAndPositionForUser({
            userTemplate,
            userId,
            event: UserActionInMeeting.Leave,
          });

          if (!u) {
            return wsError(client.id, {
              message: 'User has been deleted',
            });
          }

          Object.assign(updateData, {
            userPosition: u.position,
            userSize: u.size,
          });
        }

        const userUpdated = await this.usersService.findOneAndUpdate(
          {
            socketId: client.id,
          },
          updateData,
          session,
        );

        if (isDisconnectStatus) return;

        if (
          !isOwner &&
          meeting.owner.socketId &&
          user.accessStatus === MeetingAccessStatusEnum.RequestSent
        ) {
          this.emitToSocketId(
            user.meeting.owner.socketId,
            UserEmitEvents.RemoveUsers,
            {
              users: [userId],
            },
          );
        }

        await userUpdated.populate('meeting');
        meeting = userUpdated.meeting;

        await this.handleOutRoom({
          client,
          meeting,
          session,
          user: userUpdated,
          userTemplate,
        });
        await notifyParticipantsMeetingInfo({
          meeting,
          emitToRoom: this.emitToRoom.bind(this),
        });
      });
    } catch (error) {
      return wsError(client.id, error);
    }
  }

  @PassAuth()
  @SubscribeMessage(MeetingSubscribeEvents.OnJoinWaitingRoom)
  async handleJoinWaitingRoom(
    @MessageBody() message: JoinMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ): Promise<
    ResponseSumType<{
      user: CommonUserDTO;
      meeting: CommonMeetingDTO;
      users: CommonUserDTO[];
    }>
  > {
    return withTransaction(this.connection, async (session) => {
      try {
        const eventName = 'handleJoinWaitingRoom event';
        console.time(eventName);
        this.logger.debug({
          message: eventName,
          ctx: message,
        });

        this.logger.debug(`User joined meeting ${message.templateId}`);

        socket.join(`waitingRoom:${message.templateId}`);

        const template = await this.coreService.findMeetingTemplateById({
          id: message.templateId,
        });

        if (!template) {
          return wsError(socket.id, {
            message: 'No template found',
          });
        }

        let meeting = await this.meetingsService.findOne(
          {
            templateId: message.templateId,
          },
          session,
        );

        if (message.meetingRole == MeetingRole.Host && !meeting) {
          meeting = await this.meetingsService.createMeeting(
            {
              isMonetizationEnabled: false,
              mode: 'together',
              ownerProfileId: message.profileId,
              maxParticipants: message.maxParticipants,
              templateId: message.templateId,
            },
            session,
          );
        }

        if (!meeting) {
          return wsError(socket.id, {
            message: '[handleJoinWaitingRoom] no meeting found',
          });
        }

        if (template.user) {
          const mainUser = await this.coreService.findUserById({
            userId: template.user.id,
          });

          if (
            mainUser &&
            mainUser.maxMeetingTime === 0 &&
            this.meetingsCommonService.checkCurrentUserPlain(mainUser)
          ) {
            return {
              success: false,
              message: 'meeting.timeLimit',
            };
          }
        }

        if (
          typeof (await this.meetingsCommonService.compareActiveWithMaxParicipants(
            meeting,
            message.meetingRole == MeetingRole.Lurker
              ? 'lurker'
              : 'participant',
          )) === 'undefined'
        ) {
          return wsError(socket.id, 'meeting.maxParticipantsNumber');
        }

        const user = await this.usersService.createUser(
          {
            profileId: message.profileId,
            socketId: socket.id,
            username: message?.profileUserName,
            profileAvatar: message?.profileAvatar,
            isGenerated: !Boolean(message.profileId),
            accessStatus: message.accessStatus,
            isAuraActive: message.isAuraActive,
            micStatus: message.micStatus,
            cameraStatus: message.cameraStatus,
            avatarRole: message.avatarRole,
            meetingRole: message.meetingRole,
          },
          session,
        );

        if (message.meetingRole == MeetingRole.Host) {
          meeting = await this.meetingsService.updateMeetingById(
            meeting._id,
            { owner: user._id, hostUserId: user._id },
            session,
          );
        }

        user.meeting = meeting._id;

        await user.save({ session: session.session });

        meeting.users.push(user.id);
        meeting.save();

        await meeting.populate('users');

        const plainMeeting = meetingSerialization(meeting);
        const plainUser = userSerialization(user);
        const plainUsers = userSerialization(meeting.users);

        this.emitToRoom(
          `meeting:${plainMeeting.id}`,
          MeetingEmitEvents.UpdateMeeting,
          {
            meeting: plainMeeting,
            users: plainUsers,
          },
        );
        console.timeEnd(eventName);
        return wsResult({
          meeting: plainMeeting,
          user: plainUser,
          users: plainUsers,
        });
      } catch (error) {
        return wsError(socket.id, error);
      }
    });
  }

  @Roles([MeetingRole.Host])
  @SubscribeMessage(MeetingSubscribeEvents.OnStartMeeting)
  async startMeeting(
    @MessageBody() message: StartMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ): Promise<
    ResponseSumType<{
      user?: CommonUserDTO;
      meeting?: CommonMeetingDTO;
      users: CommonUserDTO[];
    }>
  > {
    const eventName = 'startMeeting event';
    console.time(eventName);
    this.logger.log({
      message: eventName,
      ctx: message,
    });

    return withTransaction(this.connection, async (session) => {
      try {
        this.taskService.deleteTimeout({
          name: `meeting:finish:${message.meetingId}`,
        });

        const meeting = await this.meetingsService.findById(
          message.meetingId,
          session,
        );

        const template = await this.coreService.findMeetingTemplateById({
          id: meeting.templateId,
        });

        if (!template) {
          return wsError(socket.id, {
            message: 'No template found',
          });
        }

        const mainUser = await this.coreService.findUserById({
          userId: template.user.id,
        });

        if (!mainUser) {
          return wsError(socket.id, {
            message: 'User created template not found',
          });
        }

        const user = this.getUserFromSocket(socket);

        const u = await this.usersService.updateSizeAndPositionForUser({
          userTemplate: template,
          userId: user._id.toString(),
          event: UserActionInMeeting.Join,
        });

        if (!u) {
          return wsError(socket.id, 'meeting.maxParticipantsNumber');
        }

        const lastOldMessage = await this.getLastOldMessageInMeeting(
          meeting._id.toString(),
          session,
        );

        const userUpdated = await this.usersService.findOneAndUpdate(
          { socketId: socket.id },
          {
            accessStatus: MeetingAccessStatusEnum.InMeeting,
            micStatus: message.user.micStatus,
            cameraStatus: message.user.cameraStatus,
            username: message.user.username,
            isAuraActive: message.user.isAuraActive,
            joinedAt: Date.now(),
            userPosition: u.position,
            userSize: u.size,
            ...(!!lastOldMessage && {
              lastOldMessage,
            }),
          },
          session,
        );

        await meeting.populate('users');

        if (!meeting.startAt) {
          meeting.startAt = Date.now();
        }

        let finishTime: number;

        const endsAtTimeout = getTimeoutTimestamp({
          type: TimeoutTypesEnum.Minutes,
          value: 90,
        });

        if (!meeting.endsAt) {
          meeting.endsAt = Date.now() + endsAtTimeout;

          await meeting.save();

          finishTime = endsAtTimeout;
        } else {
          finishTime = meeting.endsAt - Date.now();
        }

        await this.meetingHostTimeService.create({
          data: {
            host: user.id,
            meeting: meeting.id,
          },
          session,
        });

        const isHandleTimeLimit =
          this.meetingsCommonService.checkCurrentUserPlain(mainUser);

        if (isHandleTimeLimit) {
          this.taskService.addTimeout({
            name: `meeting:finish:${message.meetingId}`,
            ts:
              mainUser.maxMeetingTime < finishTime
                ? mainUser.maxMeetingTime
                : finishTime,
            callback: this.endMeeting.bind(this, {
              meetingId: meeting._id,
              reason: 'expired',
            }),
          });

          const timeLimitNotificationTimeout = getTimeoutTimestamp({
            value: 20,
            type: TimeoutTypesEnum.Minutes,
          });

          if (finishTime > timeLimitNotificationTimeout) {
            this.taskService.addTimeout({
              name: `meeting:timeLimit:${message.meetingId}`,
              ts: finishTime - timeLimitNotificationTimeout,
              callback: this.sendTimeLimit.bind(this, {
                meetingId: meeting._id,
                userId: user._id,
                mainUserId: mainUser.id,
              }),
            });
          }
        }

        const plainUser = userSerialization(userUpdated);

        const plainMeeting = meetingSerialization(meeting);

        const plainUsers = userSerialization(meeting.users);

        socket.join(`meeting:${message.meetingId}`);

        this.emitToRoom(
          `meeting:${meeting._id}`,
          MeetingEmitEvents.UpdateMeeting,
          {
            meeting: plainMeeting,
            users: plainUsers,
          },
        );
        console.timeEnd(eventName);

        return wsResult({
          user: plainUser,
          meeting: plainMeeting,
          users: plainUsers,
        });
      } catch (error) {
        return wsError(socket.id, error);
      }
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnSendAccessRequest)
  async sendEnterMeetingRequest(
    @MessageBody() message: EnterMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ): Promise<
    ResponseSumType<{
      user?: CommonUserDTO;
      meeting?: CommonMeetingDTO;
      users: CommonUserDTO[];
    }>
  > {
    this.logger.log({
      message: 'sendEnterMeetingRequest event',
      ctx: message,
    });
    return withTransaction(
      this.connection,
      async (session: ITransactionSession) => {
        try {
          const {
            user: { meetingAvatarId },
          } = message;

          const updateData = {
            accessStatus: MeetingAccessStatusEnum.RequestSent,
            username: message.user.username,
            isAuraActive: message.user.isAuraActive,
            micStatus: message.user.micStatus,
            cameraStatus: message.user.cameraStatus,
            meetingAvatarId: meetingAvatarId === '' ? '' : undefined,
          };

          if (meetingAvatarId) {
            const meetingAvatar = await this.coreService.findMeetingAvatar({
              query: {
                _id: meetingAvatarId,
                status: MeetingAvatarStatus.Active,
              },
            });

            if (!meetingAvatar) {
              return wsError(socket.id, {
                message: 'Meeting Avatar not found',
              });
            }
            Object.assign(updateData, {
              meetingAvatarId,
            });
          }

          const user = await this.usersService.findOneAndUpdate(
            { socketId: socket.id },
            updateData,
            session,
          );

          const meeting = await this.meetingsService.findById(
            message.meetingId,
            session,
          );
          if (!meeting) {
            return wsError(socket.id, {
              message: 'Meeting not found',
            });
          }

          await meeting.populate(['owner', 'users', 'hostUserId']);

          if (
            typeof (await this.meetingsCommonService.compareActiveWithMaxParicipants(
              meeting,
              'participant',
            )) === 'undefined'
          ) {
            return wsError(socket.id, 'meeting.maxParticipantsNumber');
          }

          const plainUser = userSerialization(user);

          const plainMeeting = meetingSerialization(meeting);

          const plainUsers = userSerialization(meeting.users);

          if (
            meeting?.hostUserId?.socketId &&
            meeting?.hostUserId?.accessStatus ===
              MeetingAccessStatusEnum.InMeeting
          ) {
            this.emitToSocketId(
              meeting?.hostUserId?.socketId,
              MeetingEmitEvents.ReceiveAccessRequest,
              {
                user: plainUser,
              },
            );

            this.emitToSocketId(
              meeting?.hostUserId?.socketId,
              MeetingEmitEvents.PlaySound,
              {
                soundType: MeetingSoundsEnum.NewAttendee,
              },
            );
          }

          return wsResult({
            user: plainUser,
            meeting: plainMeeting,
            users: plainUsers,
          });
        } catch (error) {
          return wsError(socket.id, error);
        }
      },
    );
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnCancelAccessRequest)
  async cancelAccessRequest(
    @MessageBody() message: EnterMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ): Promise<
    ResponseSumType<{
      user?: CommonUserDTO;
      meeting?: CommonMeetingDTO;
      users?: CommonUserDTO[];
    }>
  > {
    this.logger.log({
      message: 'cancelAccessRequest event',
      ctx: message,
    });

    return withTransaction(this.connection, async (session) => {
      try {
        if (!message.meetingId) return { success: true };

        const meeting = await this.meetingsService.findById(
          message.meetingId,
          session,
        );

        const user = await this.usersService.findOneAndUpdate(
          { socketId: socket.id },
          { accessStatus: MeetingAccessStatusEnum.Waiting },
          session,
        );

        await meeting.populate(['owner', 'users']);

        const plainMeeting = meetingSerialization(meeting);

        const plainUsers = userSerialization(meeting.users);

        this.emitToRoom(
          `meeting:${meeting._id}`,
          MeetingEmitEvents.UpdateMeeting,
          {
            meeting: plainMeeting,
            users: plainUsers,
          },
        );

        if (user?.socketId) {
          const plainUser = userSerialization(user);

          this.emitToSocketId(user.socketId, UserEmitEvents.UpdateUser, {
            user: plainUser,
          });
        }

        return wsResult({
          meeting: plainMeeting,
          users: plainUsers,
        });
      } catch (error) {
        return wsError(socket.id, error);
      }
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnJoinMeetingWithLurker)
  async joinMeetingWithLurker(
    @MessageBody() msg: LurkerJoinMeetingDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.debug({
      message: `[${MeetingSubscribeEvents.OnJoinMeetingWithLurker} event]`,
      ctx: msg,
    });

    return withTransaction(this.connection, async (session) => {
      try {
        const meeting = await this.meetingsService.findById(
          msg.meetingId,
          session,
        );
        if (!meeting) {
          return wsError(socket.id, {
            message: 'No meeting found',
          });
        }

        if (
          typeof (await this.meetingsCommonService.compareActiveWithMaxParicipants(
            meeting,
            'lurker',
          )) === 'undefined'
        ) {
          return wsError(socket.id, 'meeting.maxParticipantsNumber');
        }

        const lastOldMessage = await this.getLastOldMessageInMeeting(
          meeting._id.toString(),
          session,
        );

        const updateData = {
          accessStatus: MeetingAccessStatusEnum.InMeeting,
          joinedAt: Date.now(),
          username: msg.username,
          meetingAvatarId: msg.meetingAvatarId === '' ? '' : undefined,
          ...(!!lastOldMessage && {
            lastOldMessage,
          }),
        };

        if (msg.meetingAvatarId) {
          const meetingAvatar = await this.coreService.findMeetingAvatar({
            query: {
              _id: msg.meetingAvatarId,
              status: MeetingAvatarStatus.Active,
            },
          });

          if (!meetingAvatar) {
            return wsError(socket.id, {
              message: 'Meeting Avatar not found',
            });
          }
          Object.assign(updateData, {
            meetingAvatarId: msg.meetingAvatarId,
          });
        }

        const mU = await this.usersService.findOneAndUpdate(
          {
            socketId: socket.id,
            meetingRole: MeetingRole.Lurker,
          },
          updateData,
          session,
        );

        if (!mU) {
          return wsError(socket.id, {
            message: 'No user found',
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
        socket.join(`lurker:${msg.meetingId}`);
        socket.join(`meeting:${msg.meetingId}`);

        const plainMeeting = meetingSerialization(meeting);
        const plainUser = userSerialization(mU);
        const plainUsers = userSerialization(meeting.users);
        this.emitToSocketId(host.socketId, MeetingEmitEvents.UpdateMeeting, {
          meeting: plainMeeting,
          users: plainUsers,
        });

        return wsResult({
          meeting: plainMeeting,
          user: plainUser,
          users: plainUsers,
        });
      } catch (err) {
        return wsError(socket.id, err);
      }
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnAnswerAccessRequest)
  async sendAccessAnswer(
    @MessageBody() message: MeetingAccessAnswerRequestDTO,
    @ConnectedSocket() socket: Socket,
  ): Promise<ResponseSumType<void>> {
    this.logger.debug({
      message: `[${MeetingSubscribeEvents.OnAnswerAccessRequest}] event`,
      ctx: message,
    });

    return withTransaction(this.connection, async (session) => {
      try {
        const meeting = await this.meetingsService.findById(
          message.meetingId,
          session,
        );

        const template = await this.coreService.findMeetingTemplateById({
          id: meeting.templateId,
        });

        let user = await this.usersService.findOne({
          query: {
            _id: new ObjectId(message.userId),
            accessStatus: { $eq: MeetingAccessStatusEnum.RequestSent },
          },
          session,
        });

        if (message.isUserAccepted) {
          const u = await this.usersService.updateSizeAndPositionForUser({
            userId: user._id.toString(),
            event: UserActionInMeeting.Join,
            userTemplate: template,
          });

          if (!u) {
            return wsError(socket.id, 'meeting.maxParticipantsNumber');
          }

          const lastOldMessage = await this.getLastOldMessageInMeeting(
            meeting._id.toString(),
            session,
          );

          user = await this.usersService.findOneAndUpdate(
            {
              _id: user._id,
            },
            {
              accessStatus: MeetingAccessStatusEnum.InMeeting,
              joinedAt: Date.now(),
              userPosition: u.position,
              userSize: u.size,
              ...(!!lastOldMessage && {
                lastOldMessage,
              }),
            },
            session,
          );
        } else if (!message.isUserAccepted) {
          user = await this.usersService.findOneAndUpdate(
            {
              _id: user._id,
            },
            {
              accessStatus: MeetingAccessStatusEnum.Rejected,
            },
            session,
          );
          this.emitToSocketId(
            user.socketId,
            MeetingEmitEvents.ReceiveAccessRequest,
            {
              user: userSerialization(user),
            },
          );

          this.emitToSocketId(
            user.socketId,
            MeetingEmitEvents.SendMeetingError,
            {
              message: 'meeting.requestDenied',
            },
          );
        }

        if (!user) {
          return wsError(socket.id, {
            message: 'No user found',
          });
        }

        await meeting.populate(['owner', 'users']);

        const plainMeeting = meetingSerialization(meeting);
        const plainUsers = userSerialization(meeting.users);
        const plainUser = userSerialization(user);
        const emitData = {
          meeting: plainMeeting,
          users: plainUsers,
        };

        this.emitToRoom(
          `meeting:${meeting._id}`,
          MeetingEmitEvents.UpdateMeeting,
          emitData,
        );

        this.emitToRoom(
          `waitingRoom:${meeting.templateId}`,
          MeetingEmitEvents.UpdateMeeting,
          emitData,
        );

        const userSocket = await this.getSocket(
          `waitingRoom:${meeting.templateId}`,
          user.socketId,
        );

        userSocket.join(`meeting:${meeting._id}`);

        this.emitToSocketId(user.socketId, 'meeting:userAccepted', {
          user: plainUser,
        });
      } catch (error) {
        return wsError(socket.id, error);
      }
    });
  }

  async updateTimeForHost(
    socket: Socket,
    meeting: MeetingDocument,
    session: ITransactionSession,
  ) {
    const user = await this.usersService.findOne({
      query: { socketId: socket.id },
      session,
    });

    const userId = user._id.toString();

    const isMeetingHost = meeting.hostUserId === userId;

    if (isMeetingHost) {
      const profileUser = await this.coreService.findUserById({
        userId: user.profileId,
      });

      if (this.meetingsCommonService.checkCurrentUserPlain(profileUser)) {
        await this.meetingsCommonService.handleTimeLimit({
          profileId: profileUser.id,
          meetingId: meeting._id.toString(),
          meetingUserId: userId,
          maxProfileTime: profileUser.maxMeetingTime,
          session,
        });
      }
    }
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnEndMeeting)
  async endMeeting(
    @MessageBody() message: EndMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.debug({
      message: `[${MeetingSubscribeEvents.OnEndMeeting}] event`,
      ctx: message,
    });

    try {
      return withTransaction(this.connection, async (session) => {
        const meeting = await this.meetingsService.findById(
          message.meetingId,
          session,
        );

        if (!socket) {
          return wsError(null, {
            message: 'User has been deleted',
          });
        }

        if (!meeting) {
          return wsError(socket.id, {
            message: 'Meeting not found',
          });
        }

        meeting.endsAt = Date.now();
        meeting.save();

        if (
          Object.values(KickUserReasons).includes(
            message.reason as KickUserReasons,
          )
        ) {
          this.broadcastToRoom(
            socket,
            `meeting:${message.meetingId}`,
            MeetingEmitEvents.FinishMeeting,
            {
              reason: message.reason,
            },
          );
        } else {
          this.emitToRoom(
            `meeting:${message.meetingId}`,
            MeetingEmitEvents.FinishMeeting,
            {
              reason: message.reason,
            },
          );
        }

        await this.updateTimeForHost(socket, meeting, session);

        return wsResult();
      });
    } catch (error) {
      return wsError(socket.id, error);
    }
  }

  async handleTimeLimitForHost({ user, meeting, session }) {
    const profileUser = await this.coreService.findUserById({
      userId: user.profileId,
    });

    if (this.meetingsCommonService.checkCurrentUserPlain(profileUser)) {
      await this.meetingsCommonService.handleTimeLimit({
        profileId: profileUser.id,
        meetingId: meeting._id.toString(),
        meetingUserId: user.id,
        maxProfileTime: profileUser.maxMeetingTime,
        session,
      });
    }
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnLeaveMeeting)
  async leaveMeeting(
    @MessageBody() message: LeaveMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    const event = 'leaveMeeting event';
    this.logger.log({
      message: event,
      ctx: message,
    });
    return withTransaction(this.connection, async (session) => {
      try {
        const user = await this.usersService.findOne({
          query: { socketId: socket.id },
          session,
        });

        if (!user) {
          return wsError(socket.id, {
            message: 'No user found',
          });
        }

        const meeting = await this.meetingsService.findById(
          user?.meeting._id.toString(),
          session,
        );

        const userId = user._id.toString();

        await this.usersService.findOneAndUpdate(
          {
            socketId: socket.id,
          },
          {
            accessStatus: MeetingAccessStatusEnum.Left,
          },
          session,
        );

        if (meeting) {
          await meeting.populate('users');

          if (meeting?.sharingUserId === user?.id) {
            meeting.sharingUserId = null;
          }

          this.emitToRoom(`meeting:${meeting.id}`, UserEmitEvents.RemoveUsers, {
            users: [userId],
          });

          const isMeetingHost = meeting.hostUserId === userId;

          if (isMeetingHost) {
            this.handleTimeLimitForHost({ user, meeting, session });
          }

          await meeting.save();
        }

        return wsResult();
      } catch (error) {
        return wsError(socket.id, error);
      }
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnReconnect)
  async reconnect(
    @MessageBody() msg: ReconnectDto,
    @ConnectedSocket() client: Socket,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        console.log('Event Recconnect', {
          message: msg,
          ctx: client.id,
        });
        const { meetingUserId } = msg;

        const user = await this.usersService.findOne({
          query: {
            _id: meetingUserId,
            accessStatus: MeetingAccessStatusEnum.Disconnected,
          },
          session,
        });

        if (!user) {
          return wsError(client.id, {
            message: 'No user found',
          });
        }

        await user.populate('meeting');
        if (!user.meeting) {
          return wsError(client.id, {
            message: 'No meeting found',
          });
        }

        const updateData = {
          socketId: client.id,
          accessStatus: MeetingAccessStatusEnum.InMeeting,
        };

        const userTemplate = await this.coreService.findMeetingTemplateById({
          id: user.meeting.templateId,
        });
        if (!userTemplate) {
          return wsError(client.id, {
            message: 'No user template found',
          });
        }

        if (user.meetingRole !== MeetingRole.Lurker) {
          const u = await this.usersService.updateSizeAndPositionForUser({
            userTemplate,
            userId: user._id.toString(),
            event: UserActionInMeeting.Join,
          });

          if (!u) {
            return wsError(client.id, 'meeting.maxParticipantsNumber');
          }
          Object.assign(updateData, {
            userPosition: u.position,
            userSize: u.size,
          });
        }

        const userUpdated = await this.usersService.findOneAndUpdate(
          {
            _id: meetingUserId,
          },
          updateData,
          session,
        );

        await userUpdated.populate('meeting');
        const meeting = userUpdated.meeting;

        await meeting.populate(['users']);
        const meetingId = meeting._id.toString();
        client.join(`meeting:${meetingId}`);
        const plainUser = userSerialization(user);
        const plainMeeting = meetingSerialization(user.meeting);
        const plainUsers = userSerialization(meeting.users);
        this.emitToRoom(
          `meeting:${meetingId}`,
          MeetingEmitEvents.UpdateMeeting,
          {
            meeting: plainMeeting,
            users: plainUsers,
          },
        );

        this.emitToRoom(
          `meeting:${meetingId}`,
          MeetingEmitEvents.UpdateMeetingTemplate,
          { templateId: userTemplate.id },
        );

        return wsResult({
          meeting: plainMeeting,
          user: plainUser,
          users: plainUsers,
        });
      } catch (err) {
        return wsError(client.id, err);
      }
    });
  }

  @SubscribeMessage(UsersSubscribeEvents.OnChangeHost)
  async changeHost(
    @MessageBody() message: ChangeHostDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const user = await this.usersService.findById(message.userId, session);

        if (!user) {
          return wsError(socket.id, {
            message: '[changeHost]: no user found',
          });
        }

        const profileUser = await this.coreService.findUserById({
          userId: user.profileId,
        });

        await user.populate([{ path: 'meeting', populate: 'hostUserId' }]);

        if (
          profileUser &&
          profileUser?.maxMeetingTime === 0 &&
          [PlanKeys.House, PlanKeys.Professional].includes(
            profileUser?.subscriptionPlanKey,
          )
        ) {
          return {
            success: false,
            message: 'meeting.userHasNoTimeLeft',
          };
        }

        const meeting = await this.meetingsService.findById(
          user.meeting._id,
          session,
        );

        if (user?.meeting?.hostUserId?._id) {
          const prevHostUser = await this.usersService.findById(
            user.meeting.hostUserId._id,
            session,
          );

          const prevProfileHostUser = await this.coreService.findUserById({
            userId: prevHostUser.profileId,
          });

          if (
            this.meetingsCommonService.checkCurrentUserPlain(
              prevProfileHostUser,
            )
          ) {
            const hostTimeData = await this.meetingHostTimeService.update({
              query: {
                host: new Types.ObjectId(prevHostUser.id),
                meeting: meeting.id,
                endAt: null,
              },
              data: {
                endAt: Date.now(),
              },
              session,
            });

            const newTime =
              prevProfileHostUser.maxMeetingTime -
              (hostTimeData.endAt - hostTimeData.startAt);

            await this.coreService.updateUser({
              query: { _id: prevProfileHostUser.id },
              data: {
                maxMeetingTime: newTime < 0 ? 0 : newTime,
              },
            });

            if (prevHostUser?.socketId) {
              this.emitToSocketId(prevHostUser?.socketId, 'meeting:timeLimit');
            }
          }
        }

        const newMeeting = await this.meetingsService.updateMeetingById(
          meeting.id,
          {
            hostUserId: message.userId,
          },
          session,
        );

        this.taskService.deleteTimeout({
          name: `meeting:timeLimit:${meeting.id}`,
        });

        if (this.meetingsCommonService.checkCurrentUserPlain(profileUser)) {
          await this.meetingHostTimeService.create({
            data: {
              host: user.id,
              meeting: meeting.id,
            },
          });

          const timeLimitNotificationTimeout = getTimeoutTimestamp({
            value: 20,
            type: TimeoutTypesEnum.Minutes,
          });

          const meetingEndTime = meeting.endsAt - Date.now();

          this.taskService.deleteTimeout({
            name: `meeting:finish:${meeting.id}`,
          });

          this.taskService.addTimeout({
            name: `meeting:finish:${meeting.id}`,
            ts:
              profileUser.maxMeetingTime < meetingEndTime
                ? profileUser.maxMeetingTime
                : meetingEndTime,
            callback: this.endMeeting.bind(this, {
              meetingId: meeting._id,
              reason: 'expired',
            }),
          });

          if (profileUser.maxMeetingTime < meetingEndTime) {
            this.taskService.addTimeout({
              name: `meeting:timeLimit:${meeting.id}`,
              ts:
                profileUser.maxMeetingTime < timeLimitNotificationTimeout
                  ? 0
                  : profileUser.maxMeetingTime - timeLimitNotificationTimeout,
              callback: async () => {
                const hostTimeData = await this.meetingHostTimeService.update({
                  query: {
                    host: user.id,
                    meeting: meeting.id,
                    endAt: null,
                  },
                  data: {
                    endAt: Date.now(),
                  },
                });

                const newTime =
                  profileUser.maxMeetingTime -
                  (hostTimeData.endAt - hostTimeData.startAt);

                const fallBackTime =
                  this.meetingsCommonService.checkCurrentUserPlain(profileUser)
                    ? null
                    : 0;

                await this.coreService.updateUser({
                  query: { _id: profileUser.id },
                  data: {
                    maxMeetingTime: newTime < 0 ? fallBackTime : newTime,
                  },
                });

                if (user?.socketId) {
                  this.emitToSocketId(user?.socketId, 'meeting:timeLimit');
                }

                await this.meetingHostTimeService.create({
                  data: {
                    host: user.id,
                    meeting: meeting.id,
                  },
                });
              },
            });
          }

          const plainMeeting = meetingSerialization(newMeeting);

          this.emitToRoom(
            `meeting:${meeting._id}`,
            MeetingEmitEvents.UpdateMeeting,
            {
              meeting: plainMeeting,
            },
          );
        }
      } catch (error) {
        return wsError(socket.id, error);
      }
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnUpdateMeeting)
  async updateMeeting(
    @MessageBody() message: UpdateMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log({
      message: 'updateMeeting event',
      ctx: message,
    });

    return withTransaction(this.connection, async (session) => {
      try {
        const user = await this.usersService.findOne({
          query: { socketId: socket.id },
          session,
          populatePaths: 'meeting',
        });

        if (!user) {
          return wsError(socket.id, {
            message: 'The Meeting user not found',
          });
        }

        const meeting = await this.meetingsService.updateMeetingById(
          user?.meeting?._id,
          message,
          session,
        );

        const plainMeeting = meetingSerialization(meeting);

        this.emitToRoom(
          `meeting:${meeting._id}`,
          MeetingEmitEvents.UpdateMeeting,
          {
            meeting: plainMeeting,
          },
        );
      } catch (error) {
        return wsError(socket.id, error);
      }
    });
  }

  async sendTimeLimit({ meetingId, userId, mainUserId }) {
    const user = await this.usersService.findById(userId);

    const meeting = await this.meetingsService.findById(meetingId);

    if (!meeting) return;

    const mainUser = await this.coreService.findUserById({
      userId: mainUserId,
    });

    const newTime = mainUser.maxMeetingTime - (Date.now() - meeting?.startAt);

    const fallBackTime = this.meetingsCommonService.checkCurrentUserPlain(
      mainUser,
    )
      ? null
      : 0;

    await this.coreService.updateUser({
      query: { _id: mainUser.id },
      data: {
        maxMeetingTime: newTime < 0 ? fallBackTime : newTime,
      },
    });

    if (user?.socketId) {
      this.emitToSocketId(user?.socketId, 'meeting:timeLimit');
    }
  }

  @SubscribeMessage(VideoChatSubscribeEvents.SendOffer)
  async sendOffer(@MessageBody() message: SendOfferRequestDto): Promise<void> {
    this.logger.log({
      message: `[${VideoChatSubscribeEvents.SendOffer} event]`,
      ctx: {
        userId: message.userId,
        socketId: message.socketId,
      },
    });

    this.emitToSocketId(
      message.socketId,
      VideoChatEmitEvents.GetOffer,
      message,
    );

    return;
  }

  @SubscribeMessage(VideoChatSubscribeEvents.SendAnswer)
  async sendAnswer(
    @MessageBody() message: SendAnswerOfferRequestDto,
  ): Promise<void> {
    this.logger.log({
      message: `[${VideoChatSubscribeEvents.SendAnswer} event]`,
      ctx: {
        userId: message.userId,
        socketId: message.socketId,
      },
    });

    this.emitToSocketId(
      message.socketId,
      VideoChatEmitEvents.GetAnswer,
      message,
    );

    return;
  }

  @SubscribeMessage(VideoChatSubscribeEvents.SendIceCandidate)
  async sendIceCandidate(
    @MessageBody() message: SendIceCandidateRequestDto,
  ): Promise<void> {
    this.logger.log({
      message: `[${VideoChatSubscribeEvents.SendIceCandidate} event]`,
      ctx: {
        userId: message.userId,
        socketId: message.socketId,
      },
    });

    this.emitToSocketId(
      message.socketId,
      VideoChatEmitEvents.GetIceCandidate,
      message,
    );

    return;
  }

  @SubscribeMessage(VideoChatSubscribeEvents.SendDevicesPermissions)
  async updateDevicesPermissions(
    @MessageBody() message: SendDevicesPermissionsRequestDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    this.logger.log({
      message: `[${VideoChatSubscribeEvents.SendDevicesPermissions} event]`,
      ctx: {
        userId: message.userId,
      },
    });

    return withTransaction(this.connection, async (session) => {
      try {
        const user = await this.usersService.findOneAndUpdate(
          {
            _id: message.userId,
          },
          {
            cameraStatus: message.video ? 'active' : 'inactive',
            micStatus: message.audio ? 'active' : 'inactive',
          },
          session,
        );

        await user.populate('meeting');

        const plainUser = userSerialization(user);

        this.emitToRoom(
          `meeting:${user.meeting._id}`,
          UserEmitEvents.UpdateUser,
          {
            user: plainUser,
          },
        );
      } catch (error) {
        return wsError(socket.id, error);
      }
    });
  }
}
