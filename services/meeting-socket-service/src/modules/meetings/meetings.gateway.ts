import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
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
  ICommonUser,
  KickUserReasons,
  MeetingAccessStatusEnum,
  MeetingAvatarStatus,
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
import { MeetingUserDocument } from '../../schemas/meeting-user.schema';
import {
  SendAnswerPayload,
  SendDevicesPermissionsPayload,
  SendIceCandidatePayload,
  SendOfferPayload,
  UserActionInMeeting,
} from '../../types';

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

  private async updateLeaveMeetingForUser({
    client,
    session,
  }: {
    client: Socket;
    session: ITransactionSession;
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
    } catch (err) {
      throw new WsException(err);
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      return withTransaction(this.connection, async (session) => {
        const event = `handleDisconnect event - socketId: ${client.id}`;
        this.logger.log(event);
        const user = await this.updateLeaveMeetingForUser({ client, session });

        if (!user) {
          throw new WsException('[handleDisconnect] no user found');
        }

        const userId = user?._id.toString();
        const meeting = await this.meetingsService.findById(
          user?.meeting?._id,
          session,
          'owner',
        );

        if (!meeting) {
          throw new WsException('[handleDisconnect] no meeting found');
        }

        const userTemplate = await this.coreService.findMeetingTemplateById({
          id: meeting.templateId,
        });

        if (!userTemplate) {
          throw new WsException('User template not found');
        }

        await this.meetingsService.updateIndexUsers({
          userTemplate,
          user,
          event: UserActionInMeeting.Leave,
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

        await this.meetingsCommonService.handleDisconnectWithHaveParticipants({
          client,
          event,
          emitToRoom: this.emitToRoom,
          isMeetingHost,
          meeting,
          endsAt: meeting.endsAt,
          callback: this.endMeeting.bind(this, {
            meetingId,
          }),
        });
      });
    } catch (err) {
      console.log('throw error at here');
      
      this.logger.error(
        {
          message: `An error occurs, while disconnecting`,
          ctx: client.id,
        },
        JSON.stringify(err),
      );

      return {
        success: true,
      };
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
      try {
        const eventName = 'handleJoinWaitingRoom event';
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
          throw new WsException('[handleJoinWaitingRoom] no meeting found');
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
          )) === 'undefined'
        ) {
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
            avatarRole: message.avatarRole,
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
        return {
          success: true,
          result: {
            meeting: plainMeeting,
            user: plainUser,
            users: plainUsers,
          },
        };
      } catch (err) {
        this.logger.error(
          {
            message: `An error occurs, while join waiting room`,
            ctx: socket.id,
          },
          JSON.stringify(err),
        );

        return {
          success: true,
        };
      }
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
          throw new WsException('No template found');
        }

        const mainUser = await this.coreService.findUserById({
          userId: template.user.id,
        });

        const userTemplate = await this.coreService.findMeetingTemplateById({
          id: meeting.templateId,
        });

        if (!userTemplate) {
          throw new WsException('User Template not found');
        }

        const index = userTemplate.indexUsers.indexOf(null);
        if (!(index + 1)) {
          throw new WsException(
            'The meeting has reached its limit of participants',
          );
        }

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
          event: UserActionInMeeting.Join,
        });

        await meeting.populate('users');

        if (!meeting.startAt) meeting.startAt = Date.now();

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

        const plainUser = userSerialization(user);

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

        return {
          success: true,
          result: {
            user: plainUser,
            meeting: plainMeeting,
            users: plainUsers,
          },
        };
      } catch (err) {
        this.logger.error(
          {
            message: `An error occurs, while join waiting room`,
            ctx: socket.id,
          },
          JSON.stringify(err),
        );

        return {
          success: true,
        };
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
              throw new WsException('Meeting Avatar not found');
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

          await meeting.populate(['owner', 'users', 'hostUserId']);

          if (
            typeof (await this.meetingsCommonService.compareActiveWithMaxParicipants(
              meeting,
            )) === 'undefined'
          ) {
            return {
              success: false,
              message: 'meeting.maxParticipantsNumber',
            };
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

          return {
            success: true,
            result: {
              user: plainUser,
              meeting: plainMeeting,
              users: plainUsers,
            },
          };
        } catch (err) {
          this.logger.error(
            {
              message: `An error occurs, while send access request`,
              ctx: socket.id,
            },
            JSON.stringify(err),
          );

          return {
            success: true,
          };
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

        return {
          success: true,
          result: {
            meeting: plainMeeting,
            users: plainUsers,
          },
        };
      } catch (err) {
        this.logger.error(
          {
            message: `An error occurs, while canceling access request`,
            ctx: socket.id,
          },
          JSON.stringify(err),
        );

        return {
          success: true,
        };
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

        let plainUser: CommonUserDTO;

        if (message.isUserAccepted) {
          if (
            typeof (await this.meetingsCommonService.compareActiveWithMaxParicipants(
              meeting,
            )) === 'undefined'
          ) {
            return {
              success: false,
              message: 'meeting.maxParticipantsNumber',
            };
          }

          plainUser = await this.meetingsCommonService.acceptUserJoinRoom({
            meeting,
            session,
            template,
            userId: message.userId,
          });
        } else if (!message.isUserAccepted) {
          plainUser = await this.meetingsCommonService.rejectUserJoinRoom({
            userId: message.userId,
            session,
            emitToSocketId: this.emitToSocketId.bind(this),
          });
        }

        await meeting.populate(['owner', 'users']);

        const plainMeeting = meetingSerialization(meeting);
        const plainUsers = userSerialization(meeting.users);
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
          plainUser.socketId,
        );

        userSocket.join(`meeting:${meeting._id}`);

        this.emitToSocketId(plainUser.socketId, 'meeting:userAccepted', {
          user: plainUser,
        });
      } catch (err) {
        this.logger.error(
          {
            message: `An error occurs, while answer access request`,
            ctx: socket.id,
          },
          JSON.stringify(err),
        );

        return {
          success: true,
        };
      }
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
          throw new WsException('Meeting not found');
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

          if (!user) {
            throw new WsException('User has been deleted');
          }

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
        } catch (err) {
          throw new WsException(err);
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
          throw new WsException('No user found');
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

            this.emitToRoom(
              `meeting:${meeting.id}`,
              UserEmitEvents.RemoveUsers,
              {
                users: [userId],
              },
            );

            const isMeetingHost = meeting.hostUserId === userId;

            if (isMeetingHost) {
              const profileUser = await this.coreService.findUserById({
                userId: user.profileId,
              });

              if (
                this.meetingsCommonService.checkCurrentUserPlain(profileUser)
              ) {
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
      } catch (err) {
        this.logger.error(
          {
            message: `An error occurs, while leaving meeting`,
            ctx: message,
          },
          JSON.stringify(err),
        );

        return {
          success: true,
        };
      }
    });
  }

  @SubscribeMessage(UsersSubscribeEvents.OnChangeHost)
  async changeHost(
    @MessageBody() message: { userId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const user = await this.usersService.findById(message.userId, session);

        if (!user) {
          throw new WsException('[changeHost]: no user found');
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
      } catch (err) {
        this.logger.error(
          {
            message: `An error occurs, while changing the host`,
            ctx: message,
          },
          JSON.stringify(err),
        );

        return {
          success: true,
        };
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
          throw new WsException('The Meeting user not found');
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
      } catch (err) {
        this.logger.error(
          {
            message: `An error occurs, while updating the meeting`,
            ctx: message,
          },
          JSON.stringify(err),
        );

        return {
          success: true,
        };
      }
    });
  }

  async sendTimeLimit({ meetingId, userId, mainUserId }) {
    try {
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
    } catch (err) {
      throw new WsException(err);
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
      } catch (err) {
        this.logger.error(
          {
            message: `An error occurs, while sending device permissions `,
            ctx: socket.id,
          },
          JSON.stringify(err),
        );

        return {
          success: true,
        };
      }
    });
  }
}
