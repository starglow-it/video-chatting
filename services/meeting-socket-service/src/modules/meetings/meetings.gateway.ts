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
import { plainToInstance } from 'class-transformer';

import { BaseGateway } from '../../gateway/base.gateway';

import { MeetingsService } from './meetings.service';
import { UsersService } from '../users/users.service';
import { TasksService } from '../tasks/tasks.service';
import { CoreService } from '../../services/core/core.service';

import {
  ICommonUser,
  KickUserReasons,
  MeetingAccessStatusEnum,
  MeetingSoundsEnum,
  PlanKeys,
  ResponseSumType,
  TimeoutTypesEnum,
} from 'shared-types';

import { StartMeetingRequestDTO } from '../../dtos/requests/start-meeting.dto';
import { JoinMeetingRequestDTO } from '../../dtos/requests/join-meeting.dto';
import { CommonUserDTO } from '../../dtos/response/common-user.dto';
import { CommonMeetingDTO } from '../../dtos/response/common-meeting.dto';
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
import { MeetingUserDocument } from 'src/schemas/meeting-user.schema';
import { isNumber } from 'class-validator';
import { UpdateIndexUser } from 'src/types/common';

type SendOfferPayload = {
  type: string;
  sdp: string;
  userId: string;
  connectionId: string;
  socketId: string;
};

type SendAnswerPayload = {
  type: string;
  sdp: string;
  userId: string;
  connectionId: string;
  socketId: string;
};

type SendIceCandidatePayload = {
  userId: string;
  connectionId: string;
  candidate: unknown;
  socketId: string;
};

type SendDevicesPermissionsPayload = {
  userId: string;
  audio: boolean;
  video: boolean;
};


@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class MeetingsGateway
  extends BaseGateway
  implements OnGatewayDisconnect {
  private readonly logger = new Logger(MeetingsGateway.name);
  constructor(
    private meetingsService: MeetingsService,
    private usersService: UsersService,
    private coreService: CoreService,
    private taskService: TasksService,
    private meetingHostTimeService: MeetingTimeService,
    private meetingsCommonService: MeetingsCommonService,
    @InjectConnection() private connection: Connection,
  ) {
    super();
  }

  private checkHandleTimeLimitByUser(user: ICommonUser) {
    return ![PlanKeys.Business, PlanKeys.House, PlanKeys.Professional]
      .includes(user.subscriptionPlanKey);
  }

  async changeUsersPositions({ meetingId, templateId, event }): Promise<void> {
    try {
      return withTransaction(this.connection, async (session) => {

        const template = await this.coreService.findMeetingTemplateById({
          id: templateId,
        });

        const usersTemplate = await this.coreService.findMeetingTemplateById({
          id: templateId,
        });

        const updateUsersPromise = usersTemplate.indexUsers.map(async (userId, i) => {
          const user = await this.usersService.findById(userId);
          if (!user) return;

          const userPosition = template?.usersPosition?.[i];
          const userSize = template?.usersSize?.[i];

          user.userPosition = userPosition;
          user.userSize = userSize;

          return user.save();
        });

        await Promise.all(updateUsersPromise);

        const meetingUsers = await this.usersService.findUsers(
          {
            meeting: meetingId,
            accessStatus: MeetingAccessStatusEnum.InMeeting,
          },
          session,
        );

        const updatedMeeting = await this.meetingsService.findById(
          meetingId,
          session,
          ['owner', 'users'],
        );

        if (updatedMeeting) {
          const plainUsers = plainToInstance(CommonUserDTO, meetingUsers, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          });

          const plainMeeting = plainToInstance(
            CommonMeetingDTO,
            updatedMeeting,
            {
              excludeExtraneousValues: true,
              enableImplicitConversion: true,
            },
          );

          this.emitToRoom(
            `waitingRoom:${templateId}`,
            MeetingEmitEvents.UpdateMeeting,
            {
              meeting: plainMeeting,
              users: plainUsers,
            },
          );

          this.emitToRoom(
            `meeting:${plainMeeting.id}`,
            MeetingEmitEvents.UpdateMeeting,
            {
              meeting: plainMeeting,
              users: plainUsers,
            },
          );
        }
      });
    } catch (err) {
      this.logger.error({
        message: err.message,
        event
      });
      return;
    }
  }

  private async updateLeaveMeetingForUser({
    client, session
  }:
    {
      client: Socket, session: ITransactionSession
    }): Promise<MeetingUserDocument> {
    try {
      const user = await this.usersService.findOneAndUpdate(
        {
          socketId: client.id,
          accessStatus: MeetingAccessStatusEnum.InMeeting,
        },
        { accessStatus: MeetingAccessStatusEnum.Left },
        session,
      );

      return user;
    }
    catch (err) {
      this.logger.error({
        message: err.message,
        ctx: client.id
      });
      return;
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      return withTransaction(this.connection, async (session) => {
        const event = `handleDisconnect event - socketId: ${client.id}`;
        this.logger.log(event);
        const user = await this.updateLeaveMeetingForUser({ client, session });

        if (!user) {
          this.logger.error({
            message: '[handleDisconnect] no user found',
            ctx: {
              socketId: client.id,
            },
          });
          return;
        }

        const userId = user?._id.toString();
        const meeting = await this.meetingsService.findById(
          user?.meeting?._id,
          session,
          'owner',
        );

        if (!meeting) {
          this.logger.error({
            message: '[handleDisconnect] no meeting found',
            ctx: {
              meetingId: user?.meeting?._id,
            }
          });
          return;
        }

        const userTemplate = await this.coreService.findMeetingTemplateById({
          id: meeting.templateId,
        });

        if (!userTemplate) {
          this.logger.error({
            message: 'User template not found',
            ctx: client.id
          });
          return;
        }

        await this.meetingsService.updateIndexUsers({
          userTemplate,
          user,
          event: UpdateIndexUser.Leave,
        });

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
            accessStatus: MeetingAccessStatusEnum.InMeeting,
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

        this.emitToRoom(
          `meeting:${user.meeting._id}`,
          UserEmitEvents.RemoveUsers,
          {
            users: [userId],
          },
        );

        const meetingId = meeting._id.toString();

        const isOwner = meeting.owner._id.toString() === userId;
        const isMeetingHost = meeting.hostUserId._id.toString() === userId;

        if (
          !isOwner &&
          meeting?.owner?.socketId &&
          user?.accessStatus === MeetingAccessStatusEnum.RequestSent
        ) {
          this.emitToSocketId(
            meeting?.owner?.socketId,
            UserEmitEvents.RemoveUsers,
            {
              users: [userId],
            },
          );
        }

        try {
          let profileUser = null;
          if (user.profileId) {
            profileUser = await this.coreService.findUserById({
              userId: user.profileId,
            });
          }

          if (profileUser) {
            await this.coreService.updateUserProfileStatistic({
              userId: profileUser.id,
              statisticKey: 'minutesSpent',
              value: timeToAdd,
            });

            if (isMeetingHost && this.checkHandleTimeLimitByUser(profileUser)) {
              await this.meetingsCommonService.handleTimeLimit({
                profileId: profileUser.id,
                meetingId,
                meetingUserId: userId,
                maxProfileTime: profileUser.maxMeetingTime,
                session,
              });
            }
          }

        } catch (err) {
          this.logger.error('User has been deleted', err.message);
          return;
        }

        if (activeParticipants !== 0) {
          if (isMeetingHost) {
            const endTimestamp = getTimeoutTimestamp({
              type: TimeoutTypesEnum.Minutes,
              value: 15,
            });

            console.log('timeout', endTimestamp);


            const meetingEndTime =
              (meeting.endsAt || Date.now()) - Date.now();

            this.taskService.deleteTimeout({
              name: `meeting:finish:${meetingId}`,
            });

            this.taskService.addTimeout({
              name: `meeting:finish:${meetingId}`,
              ts:
                meetingEndTime > endTimestamp ? endTimestamp : meetingEndTime,
              callback: this.endMeeting.bind(this, {
                meetingId: meeting._id,
              }),
            });
          }

          this.taskService.deleteTimeout({
            name: 'meeting:changeUsersPositions',
          });

          this.taskService.addTimeout({
            name: 'meeting:changeUsersPositions',
            ts: getTimeoutTimestamp({
              value: 1,
              type: TimeoutTypesEnum.Seconds,
            }),
            callback: async () => {
              try {
                this.changeUsersPositions({
                  meetingId: meeting.id,
                  templateId: meeting.templateId,
                  event
                });
              } catch (err) {
                this.logger.error({
                  mesage: err.mesage,
                  ctx: client.id
                });
                return;
              }
            },
          });
        }

        if (activeParticipants === 0) {
          await this.meetingsCommonService.handleClearMeetingData({
            userId: meeting.owner._id,
            templateId: userTemplate.id,
            instanceId: userTemplate.meetingInstance.instanceId,
            meetingId: meeting.id,
            session,
          });
        }
      });
    } catch (err) {
      this.logger.error({
        message: err.message,
        ctx: client.id
      });
      return;
    }
  }

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
      const eventName = 'handleJoinWaitingRoom event'
      console.time(eventName);
      this.logger.debug({
        message: eventName,
        ctx: message,
      });

      this.logger.debug(`User joined meeting ${message.templateId}`);

      socket.join(`waitingRoom:${message.templateId}`);

      let meeting = await this.meetingsService.findOne(
        {
          templateId: message.templateId,
        },
        session,
      );

      if (message.isOwner && !meeting) {
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
        this.logger.error({
          message: '[handleJoinWaitingRoom] no meeting found',
          ctx: message,
        });

        return {};
      }

      const template = await this.coreService.findMeetingTemplateById({
        id: meeting.templateId,
      });

      if (template.user) {
        const mainUser = await this.coreService.findUserById({
          userId: template.user.id,
        });

        if (
          mainUser.maxMeetingTime === 0 &&
          this.checkHandleTimeLimitByUser(mainUser)
        ) {
          return {
            success: false,
            message: 'meeting.timeLimit',
          };
        }
      }

      const activeParticipants = await this.usersService.countMany({
        meeting: meeting._id,
        accessStatus: MeetingAccessStatusEnum.InMeeting,
      });

      if (activeParticipants === meeting.maxParticipants) {
        return {
          success: false,
          message: 'meeting.maxParticipantsNumber',
        };
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
        },
        session,
      );

      if (message.isOwner) {
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

      const plainMeeting = plainToInstance(CommonMeetingDTO, meeting, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const plainUser = plainToInstance(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const plainUsers = plainToInstance(CommonUserDTO, meeting.users, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      this.emitToRoom(
        `meeting:${plainMeeting.id}`,
        MeetingEmitEvents.UpdateMeeting,
        {
          meeting: plainMeeting,
          users: plainUsers,
        },
      );
      console.timeEnd(eventName);
      return {
        success: true,
        result: {
          meeting: plainMeeting,
          user: plainUser,
          users: plainUsers,
        },
      };
    });
  }

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
          this.logger.error({
            message: 'no template found',
            ctx: message,
          });

          return;
        }

        const mainUser = await this.coreService.findUserById({
          userId: template.user.id,
        });

        const userTemplate = await this.coreService.findMeetingTemplate({
          id: meeting.templateId,
        });

        if (!userTemplate) {
          this.logger.error({
            message: 'User Template not found',
            ctx: socket.id
          });
          return;
        }

        const index = userTemplate.indexUsers.indexOf(null);
        if (!(index + 1)) {
          this.logger.error({
            message: 'The meeting has reached its limit of participants',
            ctx: socket.id
          });
          return;
        };

        const user = await this.usersService.findOneAndUpdate(
          { socketId: socket.id },
          {
            accessStatus: MeetingAccessStatusEnum.InMeeting,
            micStatus: message.user.micStatus,
            cameraStatus: message.user.cameraStatus,
            username: message.user.username,
            isAuraActive: message.user.isAuraActive,
            joinedAt: Date.now(),
            userPosition: template?.usersPosition?.[index],
            userSize: template?.usersSize?.[index],
          },
          session,
        );

        await this.meetingsService.updateIndexUsers({
          userTemplate,
          user,
          event: UpdateIndexUser.Join
        });

        await meeting.populate('users');

        if (!meeting.startAt) meeting.startAt = Date.now();

        let finishTime;

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

        const isHandleTimeLimit = this.checkHandleTimeLimitByUser(mainUser);

        this.taskService.addTimeout({
          name: `meeting:finish:${message.meetingId}`,
          ts:
            mainUser.maxMeetingTime < finishTime &&
              isHandleTimeLimit
              ? mainUser.maxMeetingTime
              : finishTime,
          callback: this.endMeeting.bind(this, {
            meetingId: meeting._id,
            reason: 'expired',
          }),
        });

        if (isHandleTimeLimit) {
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

        const plainUser = plainToInstance(CommonUserDTO, user, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        const plainMeeting = plainToInstance(CommonMeetingDTO, meeting, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        const plainUsers = plainToInstance(CommonUserDTO, meeting.users, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

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

        return {
          success: true,
          result: {
            user: plainUser,
            meeting: plainMeeting,
            users: plainUsers,
          },
        };
      }
      catch (err) {
        this.logger.error({
          message: err.message,
          ctx: socket.id
        });
        return;
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
        const user = await this.usersService.findOneAndUpdate(
          { socketId: socket.id },
          {
            accessStatus: MeetingAccessStatusEnum.RequestSent,
            username: message.user.username,
            isAuraActive: message.user.isAuraActive,
            micStatus: message.user.micStatus,
            cameraStatus: message.user.cameraStatus,
          },
          session,
        );

        const meeting = await this.meetingsService.findById(
          message.meetingId,
          session,
        );

        await meeting.populate(['owner', 'users', 'hostUserId']);

        const activeParticipants = await this.usersService.countMany({
          meeting: meeting._id,
          accessStatus: MeetingAccessStatusEnum.InMeeting,
        });

        if (activeParticipants === meeting.maxParticipants) {
          return {
            success: false,
            message: 'meeting.maxParticipantsNumber',
          };
        }

        const plainUser = plainToInstance(CommonUserDTO, user, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        const plainMeeting = plainToInstance(CommonMeetingDTO, meeting, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        const plainUsers = plainToInstance(CommonUserDTO, meeting.users, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

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

        return {
          success: true,
          result: {
            user: plainUser,
            meeting: plainMeeting,
            users: plainUsers,
          },
        };
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

      const plainMeeting = plainToInstance(CommonMeetingDTO, meeting, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const plainUsers = plainToInstance(CommonUserDTO, meeting.users, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      this.emitToRoom(
        `meeting:${meeting._id}`,
        MeetingEmitEvents.UpdateMeeting,
        {
          meeting: plainMeeting,
          users: plainUsers,
        },
      );

      if (user?.socketId) {
        const plainUser = plainToInstance(CommonUserDTO, user, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        this.emitToSocketId(user.socketId, UserEmitEvents.UpdateUser, {
          user: plainUser,
        });
      }

      return {
        success: true,
        result: {
          meeting: plainMeeting,
          users: plainUsers,
        },
      };
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnAnswerAccessRequest)
  async sendAccessAnswer(
    @MessageBody() message: MeetingAccessAnswerRequestDTO,
  ): Promise<ResponseSumType<void>> {
    this.logger.debug({
      message: `[${MeetingSubscribeEvents.OnAnswerAccessRequest}] event`,
      ctx: message,
    });

    return withTransaction(this.connection, async (session) => {
      const meeting = await this.meetingsService.findById(
        message.meetingId,
        session,
      );

      const template = await this.coreService.findMeetingTemplateById({
        id: meeting.templateId,
      });

      let plainUser;

      if (message.isUserAccepted) {
        const user = await this.usersService.findById(message.userId, session);

        if (!user) return;

        const activeParticipants = await this.usersService.countMany({
          meeting: meeting._id,
          accessStatus: MeetingAccessStatusEnum.InMeeting,
        });

        if (activeParticipants === meeting.maxParticipants) {
          this.emitToSocketId(
            user.socketId,
            MeetingEmitEvents.SendMeetingError,
            {
              message: 'meeting.maxParticipantsNumber',
            },
          );

          return {
            success: false,
            message: 'meeting.maxParticipantsNumber',
          };
        }

        const usersTemplate = await this.coreService.findMeetingTemplateById({
          id: meeting.templateId,
        });

        const indexUser = usersTemplate.indexUsers.map((item, index) => {
          if (item) return;
          return index;
        }).find(item => item || isNumber(item));

        if (indexUser === -1) return;

        const updatedUser = await this.usersService.findOneAndUpdate(
          {
            _id: message.userId,
            accessStatus: { $eq: MeetingAccessStatusEnum.RequestSent },
          },
          {
            accessStatus: MeetingAccessStatusEnum.InMeeting,
            joinedAt: Date.now(),
            userPosition: template?.usersPosition?.[indexUser],
            userSize: template?.usersSize?.[indexUser],
          },
          session,
        );

        let insertIndexUserCount = 0;
        const updateIndexUsers = usersTemplate.indexUsers.map((item) => {
          if (item || insertIndexUserCount) return item;
          item = user.id.toString();
          insertIndexUserCount++;
          return item;
        });

        await this.coreService.updateUserTemplate({
          templateId: usersTemplate.id,
          userId: user.id.toString(),
          data: {
            indexUsers: updateIndexUsers,
          },
        });

        if (activeParticipants + 1 === meeting.maxParticipants) {
          const requestUsers = await this.usersService.findUsers(
            {
              meeting: meeting._id,
              accessStatus: MeetingAccessStatusEnum.RequestSent,
            },
            session,
          );

          const sendErrorPromises = requestUsers.map((user) => {
            this.emitToSocketId(
              user.socketId,
              MeetingEmitEvents.SendMeetingError,
              {
                message: 'meeting.maxParticipantsNumber',
              },
            );
          });

          await Promise.all(sendErrorPromises);
        }

        plainUser = plainToInstance(CommonUserDTO, updatedUser, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } else if (!message.isUserAccepted) {
        const user = await this.usersService.findByIdAndUpdate(
          message.userId,
          {
            accessStatus: MeetingAccessStatusEnum.Rejected,
          },
          session,
        );

        if (!user) return;

        plainUser = plainToInstance(CommonUserDTO, user, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        this.emitToSocketId(
          user.socketId,
          MeetingEmitEvents.ReceiveAccessRequest,
          {
            user: plainUser,
          },
        );

        this.emitToSocketId(user.socketId, MeetingEmitEvents.SendMeetingError, {
          message: 'meeting.requestDenied',
        });
      }

      await meeting.populate(['owner', 'users']);

      const plainMeeting = plainToInstance(CommonMeetingDTO, meeting, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const plainUsers = plainToInstance(CommonUserDTO, meeting.users, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      this.emitToRoom(
        `meeting:${meeting._id}`,
        MeetingEmitEvents.UpdateMeeting,
        {
          meeting: plainMeeting,
          users: plainUsers,
        },
      );

      this.emitToRoom(
        `waitingRoom:${meeting.templateId}`,
        MeetingEmitEvents.UpdateMeeting,
        {
          meeting: plainMeeting,
          users: plainUsers,
        },
      );

      const userSocket = await this.getSocket(
        `waitingRoom:${meeting.templateId}`,
        plainUser.socketId,
      );

      userSocket.join(`meeting:${meeting._id}`);

      this.emitToSocketId(plainUser.socketId, 'meeting:userAccepted', {
        user: plainUser,
      });
    });
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

        if (!meeting) {
          return {
            success: true,
          };
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

        try {
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

            if (this.checkHandleTimeLimitByUser(profileUser)) {
              await this.meetingsCommonService.handleTimeLimit({
                profileId: profileUser.id,
                meetingId: meeting._id.toString(),
                meetingUserId: userId,
                maxProfileTime: profileUser.maxMeetingTime,
                session,
              });
            }
          }
        } catch (err) {
          this.logger.error('User has been deleted', err.message);
        }

        return {
          success: true,
        };
      });
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while end meeting`,
          ctx: message,
        },
        JSON.stringify(err),
      );

      return {
        success: true,
      };
    }
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnLeaveMeeting)
  async leaveMeeting(
    @MessageBody() message: LeaveMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    const event = 'leaveMeeting event'
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
          this.logger.error({
            message: 'User not found',
            ctx: socket.id
          });
          return;
        }

        const userId = user._id.toString();

        if (user) {
          const meeting = await this.meetingsService.findById(
            user?.meeting._id.toString(),
            session,
          );

          if (meeting) {
            await meeting.populate('owner');

            if (meeting?.sharingUserId === user?.id) {
              meeting.sharingUserId = null;
            }

            this.emitToRoom(`meeting:${meeting.id}`, UserEmitEvents.RemoveUsers, {
              users: [userId],
            });

            const isMeetingHost = meeting.hostUserId === userId;

            if (isMeetingHost) {
              const profileUser = await this.coreService.findUserById({
                userId: user.profileId,
              });

              if (this.checkHandleTimeLimitByUser(profileUser)) {
                await this.meetingsCommonService.handleTimeLimit({
                  profileId: profileUser.id,
                  meetingId: meeting._id.toString(),
                  meetingUserId: userId,
                  maxProfileTime: profileUser.maxMeetingTime,
                  session,
                });
              }
            }

            await meeting.save();
          }
        }

        return {
          success: true,
        };
      }
      catch (err) {
        this.logger.error({
          message: err.message,
          ctx: socket.id
        });
        return;
      }
    });
  }

  @SubscribeMessage(UsersSubscribeEvents.OnChangeHost)
  async changeHost(@MessageBody() message: { userId: string }) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findById(message.userId, session);

      if (!user) {
        this.logger.error({
          message: '[changeHost]: no user found',
          ctx: {
            socketId: message.userId,
          },
        });

        return;
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


        if (this.checkHandleTimeLimitByUser(prevProfileHostUser)) {
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


      if (this.checkHandleTimeLimitByUser(profileUser)) {
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

              const fallBackTime = this.checkHandleTimeLimitByUser(profileUser)
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

        const plainMeeting = plainToInstance(CommonMeetingDTO, newMeeting, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        this.emitToRoom(
          `meeting:${meeting._id}`,
          MeetingEmitEvents.UpdateMeeting,
          {
            meeting: plainMeeting,
          },
        );
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
      const user = await this.usersService.findOne({
        query: { socketId: socket.id },
        session,
        populatePaths: 'meeting',
      });

      if (!user) {
        this.logger.error({
          message: 'no meeting found event',
          ctx: message,
        });

        return;
      }

      const meeting = await this.meetingsService.updateMeetingById(
        user?.meeting?._id,
        message,
        session,
      );

      const plainMeeting = plainToInstance(CommonMeetingDTO, meeting, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      this.emitToRoom(
        `meeting:${meeting._id}`,
        MeetingEmitEvents.UpdateMeeting,
        {
          meeting: plainMeeting,
        },
      );
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


    const fallBackTime =
      this.checkHandleTimeLimitByUser(mainUser) ? null : 0;

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
  async sendOffer(@MessageBody() message: SendOfferPayload): Promise<void> {
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
  async sendAnswer(@MessageBody() message: SendAnswerPayload): Promise<void> {
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
    @MessageBody() message: SendIceCandidatePayload,
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
    @MessageBody() message: SendDevicesPermissionsPayload,
  ): Promise<void> {
    this.logger.log({
      message: `[${VideoChatSubscribeEvents.SendDevicesPermissions} event]`,
      ctx: {
        userId: message.userId,
      },
    });

    return withTransaction(this.connection, async (session) => {
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

      const plainUser = plainToInstance(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      this.emitToRoom(
        `meeting:${user.meeting._id}`,
        UserEmitEvents.UpdateUser,
        {
          user: plainUser,
        },
      );
    });
  }
}
