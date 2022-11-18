import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Socket } from 'socket.io';
import { plainToClass, plainToInstance } from 'class-transformer';

import { BaseGateway } from '../../gateway/base.gateway';

import { MeetingsService } from './meetings.service';
import { UsersService } from '../users/users.service';
import { TasksService } from '../tasks/tasks.service';
import { CoreService } from '../../services/core/core.service';

import {
  ResponseSumType,
  MeetingSoundsEnum,
  MeetingAccessStatusEnum,
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
  implements OnGatewayDisconnect
{
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

  async changeUsersPositions({ meetingId, templateId }) {
    try {
      return withTransaction(this.connection, async (session) => {
        const users = await this.usersService.findUsers(
          {
            meeting: meetingId,
            accessStatus: MeetingAccessStatusEnum.InMeeting,
          },
          session,
        );

        const template = await this.coreService.findMeetingTemplateById({
          id: templateId,
        });

        const updateUsersPromises = users.map(async (user, index) => {
          const userPosition = template?.usersPosition?.[index];

          const updateUser = await this.usersService.findOne({
            query: {
              _id: user._id,
            },
            session,
          });

          updateUser.userPosition = userPosition;

          return updateUser.save();
        });

        await Promise.all(updateUsersPromises);

        const meetingUsers = await this.usersService.findUsers(
          { meeting: meetingId },
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

          const plainMeeting = plainToClass(CommonMeetingDTO, updatedMeeting, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          });

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
    } catch (e) {
      console.log(e);
    }
  }

  async handleDisconnect(client: any) {
    return withTransaction(this.connection, async (session) => {
      this.logger.log(`handleDisconnect event - socketId: ${client.id}`);

      const user = await this.usersService.findOne({
        query: { socketId: client.id },
        session,
        populatePaths: 'meeting',
      });

      if (!user) {
        this.logger.error({
          message: '[handleDisconnect] no user found',
          ctx: {
            socketId: client.id,
          },
        });

        return;
      }

      const plainUser = plainToClass(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const meeting = await this.meetingsService.findById(
        user?.meeting?._id,
        session,
        ['owner', 'users'],
      );

      if (!meeting) {
        this.logger.error({
          message: '[handleDisconnect] no meeting found',
          ctx: {
            meetingId: user?.meeting?._id,
          },
        });

        return;
      }

      const userTemplate = await this.coreService.findMeetingTemplateById({
        id: meeting.templateId,
      });

      const commonTemplate =
        await this.coreService.findCommonTemplateByTemplateId({
          templateId: userTemplate.templateId,
        });

      const timeToAdd = Date.now() - user.joinedAt;

      await this.coreService.updateRoomRatingStatistic({
        templateId: commonTemplate.id,
        userId: commonTemplate?.author,
        ratingKey: 'minutes',
        value: timeToAdd,
      });

      if (user.profileId) {
        await this.coreService.updateUserProfileStatistic({
          userId: user.profileId,
          statisticKey: 'minutesSpent',
          value: timeToAdd,
        });
      }

      if (meeting?.sharingUserId === user?.id) {
        meeting.sharingUserId = null;
      }

      if (meeting?.hostUserId === user?.id) {
        meeting.hostUserId = null;
      }

      if (
        meeting?.sharingUserId === user?.id ||
        meeting?.hostUserId === user?.id
      ) {
        await meeting.save({ session: session.session });
      }

      await user.delete({ session: session.session });

      const template = await this.coreService.findMeetingTemplateById({
        id: meeting.templateId,
      });

      const meetingUsers = await this.usersService.findUsers(
        { meeting: meeting.id },
        session,
      );

      const activeParticipants = meetingUsers.length;

      const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      if (template) {
        const profileUser = await this.coreService.findUserById({
          userId: template.user.id,
        });

        if (user?.accessStatus === MeetingAccessStatusEnum.InMeeting) {
          this.emitToRoom(
            `meeting:${user.meeting._id}`,
            UserEmitEvents.RemoveUsers,
            {
              users: [plainUser.id],
            },
          );
        }

        const isOwner = plainMeeting.owner === plainUser.id;
        const isMeetingHost = plainMeeting.hostUserId === plainUser.id;

        if (
          !isOwner &&
          meeting?.owner?.socketId &&
          plainUser?.accessStatus === MeetingAccessStatusEnum.RequestSent
        ) {
          this.emitToSocketId(
            meeting?.owner?.socketId,
            UserEmitEvents.RemoveUsers,
            {
              users: [plainUser.id],
            },
          );
        }

        if (profileUser.subscriptionPlanKey !== 'Business') {
          await this.meetingsCommonService.handleTimeLimit({
            profileId: template.user.id,
            meetingId: plainMeeting.id,
            meetingUserId: plainUser.id,
            maxProfileTime: profileUser.maxMeetingTime,
            session,
          });
        }

        if (activeParticipants === 0) {
          await this.meetingsCommonService.handleClearMeetingData({
            instanceId: template.meetingInstance.instanceId,
            meetingId: meeting.id,
            session,
          });
        } else {
          if (
            isMeetingHost &&
            plainUser?.accessStatus !== MeetingAccessStatusEnum.Waiting
          ) {
            const endTimestamp = getTimeoutTimestamp({
              type: TimeoutTypesEnum.Minutes,
              value: 15,
            });

            const meetingEndTime = (meeting.endsAt || Date.now()) - Date.now();

            this.taskService.deleteTimeout({
              name: `meeting:finish:${plainMeeting.id}`,
            });

            this.taskService.addTimeout({
              name: `meeting:finish:${plainMeeting.id}`,
              ts: meetingEndTime > endTimestamp ? endTimestamp : meetingEndTime,
              callback: this.endMeeting.bind(this, {
                meetingId: meeting._id,
                client,
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
              await this.changeUsersPositions({
                meetingId: meeting.id,
                templateId: meeting.templateId,
              });
            },
          });
        }
      }
    });
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
      this.logger.debug({
        message: 'handleJoinWaitingRoom event',
        ctx: message,
      });

      // TODO: fetch main instance
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

      const mainUser = await this.coreService.findUserById({
        userId: template.user.id,
      });

      if (
        mainUser.maxMeetingTime === 0 &&
        mainUser.subscriptionPlanKey !== 'Business'
      ) {
        return {
          success: false,
          message: 'meeting.timeLimit',
        };
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

      meeting = await this.meetingsService.addUserToMeeting(
        {
          meetingId: meeting._id,
          userId: user.id,
        },
        session,
      );

      await meeting.populate('users');

      const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const plainUser = plainToClass(CommonUserDTO, user, {
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
    this.logger.log({
      message: 'startMeeting event',
      ctx: message,
    });

    return withTransaction(this.connection, async (session) => {
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

      const activeParticipants = await this.usersService.countMany({
        meeting: meeting._id,
        accessStatus: MeetingAccessStatusEnum.InMeeting,
      });

      const user = await this.usersService.findOneAndUpdate(
        { socketId: socket.id },
        {
          accessStatus: MeetingAccessStatusEnum.InMeeting,
          micStatus: message.user.micStatus,
          cameraStatus: message.user.cameraStatus,
          username: message.user.username,
          isAuraActive: message.user.isAuraActive,
          joinedAt: Date.now(),
          userPosition: template?.usersPosition?.[activeParticipants],
        },
        session,
      );

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

      this.taskService.addTimeout({
        name: `meeting:finish:${message.meetingId}`,
        ts:
          mainUser.maxMeetingTime < finishTime &&
          mainUser.subscriptionPlanKey !== 'Business'
            ? mainUser.maxMeetingTime
            : finishTime,
        callback: this.endMeeting.bind(this, {
          meetingId: meeting._id,
          reason: 'expired',
        }),
      });

      if (mainUser.subscriptionPlanKey !== 'Business') {
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

      const plainUser = plainToClass(CommonUserDTO, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
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

      return {
        success: true,
        result: {
          user: plainUser,
          meeting: plainMeeting,
          users: plainUsers,
        },
      };
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

        const plainUser = plainToClass(CommonUserDTO, user, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
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

      const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
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
        const plainUser = plainToClass(CommonUserDTO, user, {
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

        const updatedUser = await this.usersService.findOneAndUpdate(
          {
            _id: message.userId,
            accessStatus: { $eq: MeetingAccessStatusEnum.RequestSent },
          },
          {
            accessStatus: MeetingAccessStatusEnum.InMeeting,
            joinedAt: Date.now(),
            userPosition: template?.usersPosition?.[activeParticipants],
          },
          session,
        );

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

        const userSocket = await this.getSocket(
          `waitingRoom:${meeting.templateId}`,
          user.socketId,
        );

        const plainUser = plainToClass(CommonUserDTO, updatedUser, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        userSocket.join(`meeting:${meeting._id}`);

        this.emitToSocketId(user.socketId, 'meeting:userAccepted', {
          user: plainUser,
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

        const plainUser = plainToClass(CommonUserDTO, user, {
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

      const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
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
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnEndMeeting)
  async endMeeting(@MessageBody() message: EndMeetingRequestDTO) {
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

        const template = await this.coreService.findMeetingTemplateById({
          id: meeting.templateId,
        });

        if (!template) {
          return {
            success: true,
          };
        }

        const meetingUsers = await this.usersService.findUsers(
          {
            meeting: meeting.id,
            accessStatus: MeetingAccessStatusEnum.InMeeting,
          },
          session,
        );

        const targetUsersIds = meetingUsers
          .filter((user) => !user.isGenerated)
          .map((user) => user.profileId);

        const profileUsers = await this.coreService.findUsersById({
          userIds: targetUsersIds,
        });

        const meetingTimeAccounting = profileUsers.map(async (profileUser) => {
          if (profileUser.subscriptionPlanKey !== 'Business') {
            const targetUser = meetingUsers.find(
              (meetingUser) => meetingUser.profileId === profileUser.id,
            );

            await this.meetingsCommonService.handleTimeLimit({
              session,
              profileId: profileUser.id,
              maxProfileTime: profileUser.maxMeetingTime,
              meetingUserId: targetUser.id,
              meetingId: meeting._id,
            });
          }
        });

        await Promise.all(meetingTimeAccounting);

        const overallMinutesSpent = meetingUsers.reduce(
          (acc, user) => acc + (Date.now() - user.joinedAt),
          0,
        );

        const commonTemplate =
            await this.coreService.findCommonTemplateByTemplateId({
              templateId: template.templateId,
            });

        this.coreService.updateRoomRatingStatistic({
          templateId: commonTemplate.id,
          userId: commonTemplate.author,
          ratingKey: 'minutes',
          value: overallMinutesSpent,
        });

        await this.meetingsCommonService.handleClearMeetingData({
          instanceId: template.meetingInstance.instanceId,
          meetingId: message.meetingId,
          session,
        });

        this.emitToRoom(
          `meeting:${message.meetingId}`,
          MeetingEmitEvents.FinishMeeting,
          {
            reason: message.reason,
          },
        );

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
    this.logger.log({
      message: 'leaveMeeting event',
      ctx: message,
    });
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findOne({
        query: { socketId: socket.id },
        session,
        populatePaths: 'meeting',
      });

      if (user) {
        const plainUser = plainToClass(CommonUserDTO, user, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        const meeting = await this.meetingsService.findById(
          user?.meeting?._id,
          session,
        );

        const template = await this.coreService.findMeetingTemplateById({
          id: meeting.templateId,
        });

        if (meeting) {
          await meeting.populate(['owner', 'users']);

          if (meeting.hostUserId === user.id) {
            meeting.hostUserId = null;
          }

          if (meeting?.sharingUserId === user?.id) {
            meeting.sharingUserId = null;
          }

          await meeting.save();

          this.taskService.addTimeout({
            name: 'meeting:changeUsersPositions',
            ts: getTimeoutTimestamp({
              value: 1,
              type: TimeoutTypesEnum.Seconds,
            }),
            callback: async () => {
              await this.changeUsersPositions({
                meetingId: meeting.id,
                templateId: meeting.templateId,
              });
            },
          });

          this.emitToRoom(`meeting:${meeting.id}`, UserEmitEvents.RemoveUsers, {
            users: [plainUser.id],
          });

          const isMeetingHost = meeting?.hostUserId?._id === plainUser.id;

          const hostProfileUser = await this.coreService.findUserById({
            userId: template.user.id,
          });

          if (hostProfileUser.subscriptionPlanKey !== 'Business') {
            await this.meetingsCommonService.handleTimeLimit({
              session,
              profileId: hostProfileUser.id,
              meetingId: meeting.id,
              maxProfileTime: hostProfileUser.maxMeetingTime,
              meetingUserId: plainUser.id,
            });
          }

          const activeParticipants = await this.usersService.countMany({
            meeting: meeting._id,
            accessStatus: MeetingAccessStatusEnum.InMeeting,
          });

          const commonTemplate =
            await this.coreService.findCommonTemplateByTemplateId({
              templateId: template.templateId,
            });

          const timeToAdd = Date.now() - user.joinedAt;

          await this.coreService.updateRoomRatingStatistic({
            templateId: commonTemplate.id,
            ratingKey: 'minutes',
            value: timeToAdd,
          });

          if (user.profileId) {
            await this.coreService.updateUserProfileStatistic({
              userId: user.profileId,
              statisticKey: 'minutesSpent',
              value: timeToAdd,
            });
          }

          if (activeParticipants === 1) {
            await this.meetingsCommonService.handleClearMeetingData({
              instanceId: template.meetingInstance.instanceId,
              meetingId: message.meetingId,
              session,
            });
          } else {
            if (isMeetingHost) {
              this.taskService.deleteTimeout({
                name: `meeting:timeLimit:${message.meetingId}`,
              });

              await this.usersService.deleteUser(
                { socketId: socket.id },
                session,
              );
              const endTimestamp = getTimeoutTimestamp({
                type: TimeoutTypesEnum.Minutes,
                value: 15,
              });

              const meetingEndTime = meeting.endsAt - Date.now();

              this.taskService.deleteTimeout({
                name: `meeting:finish:${meeting.id}`,
              });

              this.taskService.addTimeout({
                name: `meeting:finish:${meeting.id}`,
                ts:
                  meetingEndTime > endTimestamp ? endTimestamp : meetingEndTime,
                callback: this.endMeeting.bind(this, message, socket),
              });
            }
          }
        }
      }

      return {
        success: true,
      };
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
        !profileUser?.maxMeetingTime &&
        profileUser?.subscriptionPlanKey !== 'Business'
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
          user?.meeting?.hostUserId?._id,
          session,
        );

        const prevProfileHostUser = await this.coreService.findUserById({
          userId: prevHostUser.profileId,
        });

        if (prevProfileHostUser.subscriptionPlanKey !== 'Business') {
          const hostTimeData = await this.meetingHostTimeService.update({
            query: {
              host: prevHostUser.id,
              meeting: meeting.id,
              endAt: null,
            },
            data: {
              endAt: Date.now(),
            },
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

      if (profileUser?.subscriptionPlanKey !== 'Business') {
        const newMeeting = await this.meetingsService.updateMeetingById(
          meeting.id,
          {
            hostUserId: message.userId,
          },
          session,
        );

        await this.meetingHostTimeService.create({
          data: {
            host: user.id,
            meeting: meeting.id,
          },
        });

        this.taskService.deleteTimeout({
          name: `meeting:timeLimit:${meeting.id}`,
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

              await this.coreService.updateUser({
                query: { _id: profileUser.id },
                data: {
                  maxMeetingTime: newTime < 0 ? 0 : newTime,
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

        const plainMeeting = plainToClass(CommonMeetingDTO, newMeeting, {
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

      const plainMeeting = plainToClass(CommonMeetingDTO, meeting, {
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

    await this.coreService.updateUser({
      query: { _id: mainUser.id },
      data: {
        maxMeetingTime: newTime < 0 ? 0 : newTime,
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

      const plainUser = plainToClass(CommonUserDTO, user, {
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
