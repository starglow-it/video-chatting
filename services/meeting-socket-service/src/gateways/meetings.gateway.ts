import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  WebSocketGateway,
  SubscribeMessage
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { Socket } from 'socket.io';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import OpenAI from 'openai'

import { BaseGateway } from './base.gateway';

import { MeetingQuestionAnswersService } from '../modules/meeting-question-answer/meeting-question-answer.service';
import { MeetingsService } from '../modules/meetings/meetings.service';
import { UsersService } from '../modules/users/users.service';
import { TasksService } from '../modules/tasks/tasks.service';
import { CoreService } from '../services/core/core.service';
import { MeetingRecordService } from '../modules/meeting-record/meeting-record.service';
import { MeetingRecordCommonService } from '../modules/meeting-record/meeting-record.common';
import { ConfigClientService } from '../services/config/config.service';
import { MeetingDonationsService } from '../modules/meeting-donations/meeting-donations.service';
import { MeetingPreEventPaymentService } from '../modules/meeting-pre-event-payment/meeting-pre-event-payment.service';
import { NotificationsService } from '../services/notifications/notifications.service';

import {
  FinishMeetingReason,
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

import { StartMeetingRequestDTO } from '../dtos/requests/start-meeting.dto';
import { UpdateMeetingLinkRequestDTO } from '../dtos/requests/update-meetinglink.dto';
import { JoinMeetingRequestDTO } from '../dtos/requests/join-meeting.dto';
import { userSerialization } from '../dtos/response/common-user.dto';
import { recordSerialization } from '../dtos/response/common-meetingRecord.dto';
import { meetingSerialization } from '../dtos/response/common-meeting.dto';
import { EnterMeetingRequestDTO } from '../dtos/requests/enter-meeting.dto';
import { MeetingAccessAnswerRequestDTO } from '../dtos/requests/answer-access-meeting.dto';
import { EndMeetingRequestDTO } from '../dtos/requests/end-meeting.dto';
import { UpdateMeetingRequestDTO } from '../dtos/requests/update-meeting.dto';
import { SetIsMeetingRecordingRequest } from '../dtos/requests/set-is-meeting-recording.dto';

import { getTimeoutTimestamp } from '../utils/getTimeoutTimestamp';
import {
  ITransactionSession,
  withTransaction,
} from '../helpers/mongo/withTransaction';
import { isValidObjectId } from '../helpers/mongo/isValidObjectId';
import { MeetingTimeService } from '../modules/meeting-time/meeting-time.service';
import {
  MeetingEmitEvents,
  UserEmitEvents,
  VideoChatEmitEvents,
} from '../const/socket-events/emitters';
import {
  MeetingSubscribeEvents,
  UsersSubscribeEvents,
  VideoChatSubscribeEvents,
} from '../const/socket-events/subscribers';
import { MeetingsCommonService } from '../modules/meetings/meetings.common';
import { MeetingUserDocument } from '../schemas/meeting-user.schema';
import { MeetingDocument } from '../schemas/meeting.schema';
import { subscribeWsError, throwWsError, wsError } from '../utils/ws/wsError';
import { ReconnectDto } from '../dtos/requests/recconnect.dto';
import { AudienceJoinMeetingDto } from '../dtos/requests/audience-join-meeting.dto';
import { wsResult } from '../utils/ws/wsResult';
import { ObjectId } from '../utils/objectId';
import { MeetingChatsService } from '../modules/meeting-chats/meeting-chats.service';
import { ChangeHostDto } from '../dtos/requests/change-host.dto';
import { SendOfferRequestDto } from '../dtos/requests/send-offer.dto';
import { SendAnswerOfferRequestDto } from '../dtos/requests/send-answer-offer.dto';
import { SendIceCandidateRequestDto } from '../dtos/requests/send-candidate.dto';
import { SendDevicesPermissionsRequestDto } from '../dtos/requests/send-devices-permissions.dto';
import { UserActionInMeeting } from '../types';
import { PassAuth } from '../utils/decorators/passAuth.decorator';
import { Roles } from '../utils/decorators/role.decorator';
import { UsersComponent } from '../modules/users/users.component';
import { MeetingI18nErrorEnum, MeetingNativeErrorEnum, emailTemplates } from 'shared-const';
import { WsEvent } from '../utils/decorators/wsEvent.decorator';
import { TEventEmitter } from 'src/types/socket-events';
import { WsBadRequestException } from '../exceptions/ws.exception';
import { LeaveMeetingRequestDTO } from '../dtos/requests/leave-meeting.dto';
import { AudienceRequestRecording } from 'src/dtos/requests/audience-request-recording.dto';
import { GetRecordingUrlById } from 'src/dtos/requests/get-recording-url-by-id.dto';
import { SaveRecordingUrlRequest } from 'src/dtos/requests/save-recordingurl.dto';
import { GetRecordingUrlsDto } from 'src/dtos/requests/get-recording-urls.dto';
import { AudienceRequestRecordingAccept } from 'src/dtos/requests/audience-request-recording-accept.dto';
import { DeleteRecordingVideoDto } from 'src/dtos/requests/delete-recording-video.dto';
import { UpdateRecordingVideo } from 'src/dtos/requests/update-recording-video.dto';
import { SetMeetingDonations } from 'src/dtos/requests/set-meeting-donations.dto';
import { GeneratePreEventPaymentCode } from 'src/dtos/requests/generate-pre-event-payment-code.dto';
import { CheckPreEventPaymentCode } from 'src/dtos/requests/check-pre-event-payment-code.dto copy';
import { handleAiTranscription } from 'src/dtos/requests/handle-ai-transcription.dto';

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
    private meetingQuestionAnswersService: MeetingQuestionAnswersService,
    private meetingsService: MeetingsService,
    private meetingRecordService: MeetingRecordService,
    private meetingChatsService: MeetingChatsService,
    private usersService: UsersService,
    private coreService: CoreService,
    private taskService: TasksService,
    private meetingHostTimeService: MeetingTimeService,
    private meetingsCommonService: MeetingsCommonService,
    private usersComponent: UsersComponent,
    private meetingRecordCommonService: MeetingRecordCommonService,
    private configService: ConfigClientService,
    private meetingDonationsService: MeetingDonationsService,
    private meetingPreEventPaymentService: MeetingPreEventPaymentService,
    private notificationService: NotificationsService,
    @InjectConnection() private connection: Connection,
  ) {
    super();
  }

  private notifyParticipantsMeetingInfo = async ({
    meeting,
    emitToRoom,
  }: {
    emitToRoom: (...args: TEventEmitter) => void;
    meeting: MeetingDocument;
  }) => {
    const plainUsers = userSerialization(meeting.users);
    const plainMeeting = meetingSerialization(meeting);

    emitToRoom(
      `waitingRoom:${meeting.templateId}`,
      MeetingEmitEvents.UpdateMeeting,
      {
        meeting: plainMeeting,
        users: plainUsers,
      },
    );

    emitToRoom(`meeting:${plainMeeting.id}`, MeetingEmitEvents.UpdateMeeting, {
      meeting: plainMeeting,
      users: plainUsers,
    });
  };

  private async getMeetingUsersInRoom(
    meeting: MeetingDocument,
    session: ITransactionSession,
  ) {
    return this.usersService.findUsers({
      query: {
        meeting: meeting._id,
        accessStatus: {
          $in: [
            MeetingAccessStatusEnum.RequestSent,
            MeetingAccessStatusEnum.RequestSentWhenDnd,
            MeetingAccessStatusEnum.InMeeting,
            MeetingAccessStatusEnum.SwitchRoleSent,
            MeetingAccessStatusEnum.EnterName,
            MeetingAccessStatusEnum.Settings,
          ],
        },
      },
      session,
    });
  }

  async setTimeoutFinishMeeting(meeting: MeetingDocument) {
    const meetingId = meeting._id.toString() as string;
    const endTimestamp = getTimeoutTimestamp({
      type: TimeoutTypesEnum.Minutes,
      value: 90,
    });

    const meetingEndTime = (meeting.endsAt || Date.now()) - Date.now();

    this.taskService.deleteTimeout({
      name: `meeting:finish:${meetingId}`,
    });

    this.taskService.addTimeout({
      name: `meeting:finish:${meetingId}`,
      ts: meetingEndTime > endTimestamp ? endTimestamp : meetingEndTime,
      callback: async () =>
        this.endMeeting.call(this, {
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

    const meetingId = meeting._id.toString();
    const isMeetingHost = meeting.hostUserId.toString() === userId;

    const activeParticipants = await this.usersService.countMany({
      meeting: meeting._id,
      accessStatus: {
        $in: [
          MeetingAccessStatusEnum.InMeeting,
          ...(isMeetingHost &&
            user.accessStatus === MeetingAccessStatusEnum.Disconnected
            ? [MeetingAccessStatusEnum.Disconnected]
            : []),
        ],
      },
    });

    await this.coreService.updateRoomRatingStatistic({
      templateId: commonTemplate.id,
      userId: commonTemplate?.author,
      ratingKey: 'minutes',
      value: timeToAdd,
    });

    await this.meetingsCommonService.handleUserLoggedInDisconnect({
      isMeetingHost,
      meetingId,
      session,
      timeToAdd,
      user,
    });

    if (!activeParticipants) {
      //   await this.meetingsCommonService.handleClearMeetingData({
      //     userId: meeting.owner._id,
      //     templateId: userTemplate.id,
      //     instanceId: userTemplate.meetingInstance.instanceId,
      //     meetingId,
      //     session,
      //   });
      this.emitToRoom(
        `waitingRoom:${meeting.templateId}`,
        MeetingEmitEvents.FinishMeeting,
        {
          reason: FinishMeetingReason.RemoveMeeting,
        },
      );
      return;
    }

    if (isMeetingHost) {
      const prevHost = await this.getPreviousHost(meeting);
      if (prevHost) {
        meeting = await this.meetingsService.updateMeetingById({
          id: meeting._id,
          data: { owner: prevHost._id, hostUserId: prevHost._id },
          session,
        });
      }
      await this.setTimeoutFinishMeeting(meeting);
    }

    await meeting.populate(['owner', 'users']);

    await this.notifyParticipantsMeetingInfo({
      meeting,
      emitToRoom: this.emitToRoom.bind(this),
    });
  }

  private async getPreviousHost(meeting: MeetingDocument) {
    const hosts = await this.usersService.findUsers({
      query: {
        meeting,
        meetingRole: MeetingRole.Host,
        accessStatus: MeetingAccessStatusEnum.InMeeting,
      },
      options: {
        sort: { _id: -1 },
        limit: 1,
      },
    });
    return hosts[0];
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

  isChangeVideoContainer = (user: MeetingUserDocument) =>
    user.meetingRole !== MeetingRole.Audience &&
    [MeetingAccessStatusEnum.InMeeting, MeetingAccessStatusEnum.Left].includes(
      user.accessStatus as MeetingAccessStatusEnum,
    );

  async handleDisconnect(client: Socket) {
    console.log(`handleDisconnect ${client.id}`);

    return withTransaction(
      this.connection,
      async (session) => {
        const user = await this.usersService.findOne({
          query: { socketId: client.id },
          session,
        });

        if (!user) return wsResult();

        await this.usersComponent.findMeetingFromPopulateUser(user);

        const userId = user._id.toString();
        let meeting = await this.usersComponent.findMeetingFromPopulateUser(
          user,
        );
        await meeting.populate(['owner', 'users']);
        const isOwner = meeting.owner._id.toString() === userId;

        const userProfileId = user.profileId.toString();
        const isHost = meeting.ownerProfileId.toString() === userProfileId;

        const userTemplate = await this.coreService.findMeetingTemplateById({
          id: meeting.templateId,
        });

        if (!userTemplate) {
          await this.meetingsCommonService.clearMeeting({
            meetingId: meeting._id,
            session,
          });

          return wsResult();
        }

        // if (!!meeting.users) {
        //   const usersInMeeting = meeting.users.findIndex(_user =>
        //     _user.accessStatus === MeetingAccessStatusEnum.InMeeting && user._id.toString() !== _user._id.toString()
        //   )

        //   if (usersInMeeting === -1) {
        //     await this.usersComponent.updateManyUsers({
        //       query: { meeting: meeting._id },
        //       data: { isPaywallPaid: false },
        //       isNew: false,
        //       session
        //     });
        //   }
        // }

        let accessStatusUpdate = MeetingAccessStatusEnum.Left;
        if (user.accessStatus === MeetingAccessStatusEnum.InMeeting) {
          accessStatusUpdate = MeetingAccessStatusEnum.Disconnected;
        }

        const updateData = {
          accessStatus: accessStatusUpdate,
          leaveAt: new Date()
        };

        if (this.isChangeVideoContainer(user)) {
          const u = await this.usersService.updateVideoContainer({
            userTemplate,
            userId,
            event: UserActionInMeeting.Leave,
          });

          throwWsError(!u, MeetingNativeErrorEnum.USER_HAS_BEEN_DELETED);

          Object.assign(updateData, {
            userPosition: u.position,
            userSize: u.size,
          });
        }

        const userUpdated = await this.usersComponent.findOneAndUpdate({
          query: {
            socketId: client.id,
          },
          data: updateData,
          session,
        });

        if (
          isHost &&
          (meeting.isMeetingRecording || meeting.isMeetingRecordingByRequest) &&
          meeting.recordingUrl
        ) {
          const result = await this.meetingRecordCommonService.stopRecording({ roomUrl: `${meeting.recordingUrl}?role=recorder` });

          if (result && result.data) {
            if (meeting.isMeetingRecordingByRequest) {
              await this.meetingRecordService.createMeetingRecord({ data: { meetingId: meeting._id, url: result.data.url } });
            }

            await this.meetingsService.findByIdAndUpdate({
              id: meeting._id,
              data: {
                isMeetingRecordingByRequest: false,
                isMeetingRecording: false,
                recordingUrl: ''
              },
              session
            });
          }
        }

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
        meeting = await this.usersComponent.findMeetingFromPopulateUser(
          userUpdated,
        );

        await this.handleOutRoom({
          client,
          meeting,
          session,
          user: userUpdated,
          userTemplate,
        });
      },
      {
        onFinaly: (err) => wsError(client, err),
      },
    );
  }

  @PassAuth()
  @WsEvent(MeetingSubscribeEvents.OnJoinWaitingRoom)
  async handleJoinWaitingRoom(
    @MessageBody() message: JoinMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return await withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const { userData, previousMeetingUserId, isScheduled } = message;
        const waitingRoom = `waitingRoom:${userData.templateId}`;
        const rejoinRoom = `rejoin:${userData.templateId}`;
        this.joinRoom(socket, waitingRoom);
        this.leaveRoom(socket, rejoinRoom);

        const template = await this.coreService.findMeetingTemplateById({
          id: userData.templateId,
        });

        throwWsError(!template, 'No template found');

        let meeting = await this.meetingsService.findOne({
          query: {
            templateId: userData.templateId,
          },
          populatePaths: 'users',
          session,
        });

        const links = !!template.links
          ? template.links.map(link => ({
            url: link.item,
            users: []
          }))
          : null;

        if (userData.meetingRole == MeetingRole.Host) {
          if (
            meeting &&
            meeting.users?.length > 0 &&
            meeting.users?.findIndex(meetingUser =>
              meetingUser.meetingRole !== MeetingRole.Host &&
              meetingUser.accessStatus === MeetingAccessStatusEnum.InMeeting
            ) === -1
          ) {
            await this.meetingsCommonService.handleClearMeetingData({
              userId: meeting.ownerProfileId,
              templateId: template?.id,
              instanceId: template?.meetingInstance?.instanceId,
              meetingId: meeting?.id,
              session,
            });
            const meetingWaitingUsers = meeting.users?.filter(meetingUser => meetingUser.accessStatus === MeetingAccessStatusEnum.Waiting);

            if (meetingWaitingUsers.length > 0) {
              meeting.users = meetingWaitingUsers;
              await meeting.save();
            }
            // meeting = null;
          }

          if (!meeting) {
            meeting = await this.meetingsService.createMeeting({
              data: {
                isMonetizationEnabled: false,
                mode: 'together',
                ownerProfileId: userData.profileId,
                maxParticipants: userData.maxParticipants,
                templateId: userData.templateId,
                links
              },
              session,
            });
          }
        }

        if (!meeting) {
          socket.join(rejoinRoom);
          throw new WsBadRequestException(
            MeetingNativeErrorEnum.MEETING_NOT_FOUND,
          );
        }

        if (template.user) {
          const mainUser = await this.coreService.findUserById({
            userId: template.user.id,
          });

          throwWsError(
            mainUser &&
            mainUser.maxMeetingTime === 0 &&
            this.meetingsCommonService.checkCurrentUserPlain(mainUser),
            MeetingI18nErrorEnum.TIME_LIMIT,
          );
        }

        let user: MeetingUserDocument;
        let isExist = false;

        if (previousMeetingUserId && meeting) {
          let userModel: MeetingUserDocument;

          const prevMeetingUser = await this.usersComponent.findById({ id: previousMeetingUserId, session });
          if (!!prevMeetingUser && (prevMeetingUser.meeting.toString() === meeting._id.toString())) {
            userModel = prevMeetingUser;
          }

          if (!!userModel) {
            if (userModel.accessStatus !== MeetingAccessStatusEnum.InMeeting) {

              const { templatePayments } = await this.coreService.findTemplatePayment({
                userTemplateId: meeting.templateId,
                userId: template.user.id
              });

              const isAudiencePaywallPaymentEnabled = !!templatePayments && templatePayments.findIndex(tp => tp.type === 'paywall' && tp.meetingRole === MeetingRole.Audience && tp.enabled) !== -1;
              const isParticipantPaywallEnabled = !!templatePayments && templatePayments.findIndex(tp => tp.type === 'paywall' && tp.meetingRole === MeetingRole.Participant && tp.enabled) !== -1;

              let accessStatus = userData.accessStatus;
              if (userModel.isPaywallPaid) {
                if (userData.meetingRole === MeetingRole.Participant && isParticipantPaywallEnabled) {
                  accessStatus = MeetingAccessStatusEnum.Settings;
                }

                if (userData.meetingRole === MeetingRole.Audience && isAudiencePaywallPaymentEnabled && !isScheduled) {
                  accessStatus = MeetingAccessStatusEnum.InMeeting;
                }
              } else {
                if (userData.meetingRole === MeetingRole.Participant && !isParticipantPaywallEnabled) {
                  accessStatus = MeetingAccessStatusEnum.Settings;
                }

                if (userData.meetingRole === MeetingRole.Audience && !isAudiencePaywallPaymentEnabled) {
                  accessStatus = MeetingAccessStatusEnum.EnterName;
                }
              }

              user = await this.usersService.findByIdAndUpdate(
                previousMeetingUserId,
                {
                  ...userData,
                  accessStatus,
                  socketId: socket.id
                },
                session
              );

              isExist = true;
            }
          }
        }

        if (!isExist) {
          user = await this.usersService.createUser(
            {
              profileId: userData.profileId,
              socketId: socket.id,
              username: userData?.profileUserName,
              profileAvatar: userData?.profileAvatar,
              isGenerated: !Boolean(userData.profileId),
              accessStatus: userData.accessStatus,
              isAuraActive: userData.isAuraActive,
              micStatus: userData.micStatus,
              cameraStatus: userData.cameraStatus,
              avatarRole: userData.avatarRole,
              meetingRole: userData.meetingRole,
            },
            session,
          );
        }

        if (
          userData.meetingRole == MeetingRole.Host &&
          !(await this.meetingsCommonService.isMaxMembers(
            meeting,
            MeetingRole.Host,
          ))
        ) {
          meeting = await this.meetingsService.updateMeetingById({
            id: meeting._id,
            data: { owner: user._id, hostUserId: user._id },
            session,
          });
        }

        user.meeting = meeting._id;

        await user.save({ session: session.session });

        const meetingUserIndex = meeting.users.findIndex(userId => userId.toString() === user.id.toString());
        if (meetingUserIndex === -1) {
          meeting.users.push(user.id);
        }

        meeting.save();

        const meetingUsers = await this.getMeetingUsersInRoom(meeting, session);

        const plainMeeting: any = meetingSerialization(meeting);
        const plainUser = userSerialization(user);
        const plainUsers = userSerialization(meetingUsers);

        this.emitToRoom(
          `meeting:${plainMeeting.id}`,
          MeetingEmitEvents.UpdateMeeting,
          {
            meeting: plainMeeting,
            users: plainUsers,
          },
        );
        return wsResult({
          meeting: plainMeeting,
          user: plainUser,
          users: plainUsers,
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @Roles([MeetingRole.Host])
  @WsEvent(MeetingSubscribeEvents.OnStartMeeting)
  async startMeeting(
    @MessageBody() message: StartMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        this.taskService.deleteTimeout({
          name: `meeting:finish:${message.meetingId}`,
        });

        const meeting = await this.meetingsService.findById({
          id: message.meetingId,
          session,
        });

        const template = await this.coreService.findMeetingTemplateById({
          id: meeting.templateId,
        });

        throwWsError(!template, 'No template found');

        const mainUser = await this.coreService.findUserById({
          userId: template.user.id,
        });

        // const user = this.getUserFromSocket(socket);

        const u = await this.usersService.updateVideoContainer({
          userTemplate: template,
          userId: message.user.id,
          event: UserActionInMeeting.Join,
        });

        throwWsError(!u, MeetingI18nErrorEnum.MAX_PARTICIPANTS_NUMBER);

        const lastOldMessage = await this.getLastOldMessageInMeeting(
          meeting._id.toString(),
          session,
        );

        const userUpdated = await this.usersComponent.findOneAndUpdate({
          query: { socketId: socket.id },
          data: {
            accessStatus: MeetingAccessStatusEnum.InMeeting,
            micStatus: message.user.micStatus,
            cameraStatus: message.user.cameraStatus,
            username: message.user.username,
            isAuraActive: message.user.isAuraActive,
            joinedAt: Date.now(),
            userPosition: u.position,
            doNotDisturb: false,
            userSize: u.size,
            ...(!!lastOldMessage && {
              lastOldMessage,
            }),
          },
          session,
        });

        await meeting.populate('users');
        meeting.startAt = Date.now();
        console.log('meeting.startAt++++++++++++++');
        console.log(meeting.startAt);
        let finishTime: number;

        const endsAtTimeout = getTimeoutTimestamp({
          type: TimeoutTypesEnum.Minutes,
          value: 90,
        });

        if (!meeting.endsAt) {
          meeting.endsAt = Date.now() + endsAtTimeout;
          finishTime = endsAtTimeout;
        } else {
          finishTime = meeting.endsAt - Date.now();
        }

        await meeting.save();

        await this.meetingHostTimeService.create({
          data: {
            host: message.user.id,
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
                userId: message.user.id,
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

        this.emitToRoom(
          `waitingRoom:${meeting.templateId}`,
          MeetingEmitEvents.UpdateMeeting,
          {
            meeting: plainMeeting,
            users: plainUsers,
          },
        );

        this.emitToRoom(
          `rejoin:${meeting.templateId}`,
          MeetingEmitEvents.RejoinWaitingRoom,
        );

        return wsResult({
          user: plainUser,
          meeting: plainMeeting,
          users: plainUsers,
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnClickMeetingLink)
  async updateMeetingLink(
    @MessageBody() message: UpdateMeetingLinkRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);

        const { meetingId, userId, url } = message;

        const meeting = await this.meetingsService.findById({
          id: meetingId,
          session,
        });

        const meetingLinks = meeting.links.map(link => {
          if (link.url === url && !link.users.includes(userId)) {
            link.users.push(userId);
          }

          return link;
        });


        await this.meetingsService.findByIdAndUpdate({
          id: meetingId,
          data: {
            links: [...meetingLinks]

          },
          session,
        });

        return wsResult();
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @Roles([MeetingRole.Participant])
  @WsEvent(MeetingSubscribeEvents.OnSendAccessRequest)
  async sendEnterMeetingRequest(
    @MessageBody() message: EnterMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session: ITransactionSession) => {
        subscribeWsError(socket);
        const {
          user: { meetingAvatarId },
        } = message;

        const user = this.getUserFromSocket(socket);

        const meeting = await this.meetingsService.findById({
          id: message.meetingId,
          session,
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        throwWsError(
          await this.meetingsCommonService.isMaxMembers(
            meeting,
            user.meetingRole,
          ),
          MeetingI18nErrorEnum.MAX_PARTICIPANTS_NUMBER,
        );

        const updateData = {
          accessStatus: MeetingAccessStatusEnum.RequestSent,
          username: message.user.username,
          isAuraActive: message.user.isAuraActive,
          micStatus: message.user.micStatus,
          cameraStatus: message.user.cameraStatus,
          meetingAvatarId: meetingAvatarId === '' ? '' : undefined,
          country: message.userLocation.country || '',
          state: message.userLocation.state || '',
        };

        if (meetingAvatarId) {
          const meetingAvatar = await this.coreService.findMeetingAvatar({
            query: {
              _id: meetingAvatarId,
              status: MeetingAvatarStatus.Active,
            },
          });

          throwWsError(!meetingAvatar, 'Meeting Avatar not found');

          Object.assign(updateData, {
            meetingAvatarId,
          });
        }

        const userUpdated = await this.usersService.findOneAndUpdate({
          query: { socketId: socket.id },
          data: updateData,
          session,
        });

        await meeting.populate(['owner', 'users', 'hostUserId']);

        const meetingUsers = await this.getMeetingUsersInRoom(meeting, session);

        const plainUser = userSerialization(userUpdated);

        const plainMeeting = meetingSerialization(meeting);

        const plainUsers = userSerialization(meetingUsers);

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
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @Roles([MeetingRole.Participant])
  @WsEvent(MeetingSubscribeEvents.OnCancelAccessRequest)
  async cancelAccessRequest(
    @MessageBody() message: EnterMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        if (!message.meetingId) return { success: true };

        const meeting = await this.meetingsService.findById({
          id: message.meetingId,
          session,
        });

        const user = await this.usersComponent.findOneAndUpdate({
          query: { socketId: socket.id },
          data: { accessStatus: MeetingAccessStatusEnum.Settings },
          session,
        });

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
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @Roles([MeetingRole.Audience])
  @WsEvent(MeetingSubscribeEvents.OnJoinMeetingWithAudience)
  async joinMeetingWithAudience(
    @MessageBody() msg: AudienceJoinMeetingDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const meeting = await this.meetingsService.findById({
          id: msg.meetingId,
          session,
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        throwWsError(
          await this.meetingsCommonService.isMaxMembers(
            meeting,
            user.meetingRole,
          ),
          MeetingI18nErrorEnum.MAX_PARTICIPANTS_NUMBER,
        );

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
          country: msg.userLocation.country,
          state: msg.userLocation.state
        };

        if (msg.meetingAvatarId) {
          const meetingAvatar = await this.coreService.findMeetingAvatar({
            query: {
              _id: msg.meetingAvatarId,
              status: MeetingAvatarStatus.Active,
            },
          });

          throwWsError(!meetingAvatar, 'Meeting Avatar not found');

          Object.assign(updateData, {
            meetingAvatarId: msg.meetingAvatarId,
          });
        }

        const mU = await this.usersComponent.findOneAndUpdate({
          query: {
            socketId: socket.id,
            meetingRole: MeetingRole.Audience,
          },
          data: updateData,
          session,
        });

        const host = await this.usersComponent.findOne({
          query: {
            _id: meeting.hostUserId,
          },
          session,
        });

        await meeting.populate(['users']);
        socket.join(`audience:${msg.meetingId}`);
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
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnJoinMeetingWithRecorder)
  async joinMeetingWithRecorder(
    @MessageBody() msg: AudienceJoinMeetingDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const meeting = await this.meetingsService.findById({
          id: msg.meetingId,
          session,
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        const updateData = {
          accessStatus: MeetingAccessStatusEnum.InMeeting,
          joinedAt: Date.now(),
          username: msg.username,
          meetingAvatarId: msg.meetingAvatarId === '' ? '' : undefined,
        };

        const mU = await this.usersComponent.findOneAndUpdate({
          query: {
            socketId: socket.id,
            meetingRole: MeetingRole.Recorder,
          },
          data: updateData,
          session,
        });

        const host = await this.usersComponent.findOne({
          query: {
            _id: meeting.hostUserId,
          },
          session,
        });

        await meeting.populate(['users']);
        socket.join(`recorder:${msg.meetingId}`);
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
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @Roles([MeetingRole.Host])
  @WsEvent(MeetingSubscribeEvents.OnAnswerAccessRequest)
  async sendAccessAnswer(
    @MessageBody() message: MeetingAccessAnswerRequestDTO,
    @ConnectedSocket() socket: Socket,
  ): Promise<ResponseSumType<void>> {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const meeting = await this.meetingsService.findById({
          id: message.meetingId,
          session,
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        const template = await this.coreService.findMeetingTemplateById({
          id: meeting.templateId,
        });

        let user = await this.usersComponent.findOne({
          query: {
            _id: new ObjectId(message.userId),
            accessStatus: { $eq: MeetingAccessStatusEnum.RequestSent },
          },
          session,
        });

        if (message.isUserAccepted) {
          const u = await this.usersService.updateVideoContainer({
            userId: user._id.toString(),
            event: UserActionInMeeting.Join,
            userTemplate: template,
            errCallback: async (err) => {
              this.emitToSocketId(
                user.socketId,
                MeetingEmitEvents.SendMeetingError,
                {
                  message: err,
                },
              );
            },
          });

          const lastOldMessage = await this.getLastOldMessageInMeeting(
            meeting._id.toString(),
            session,
          );

          user = await this.usersService.findOneAndUpdate({
            query: {
              _id: user._id,
            },
            data: {
              accessStatus: MeetingAccessStatusEnum.InMeeting,
              joinedAt: Date.now(),
              userPosition: u.position,
              userSize: u.size,
              ...(!!lastOldMessage && {
                lastOldMessage,
              }),
            },
            session,
          });
        } else if (!message.isUserAccepted) {
          user = await this.usersService.findOneAndUpdate({
            query: {
              _id: user._id,
            },
            data: {
              accessStatus: MeetingAccessStatusEnum.Rejected,
            },
            session,
          });
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
              message: MeetingI18nErrorEnum.ACCESS_REQUEST_DENINED,
            },
          );
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

        this.emitToSocketId(user.socketId, MeetingEmitEvents.AcceptRequest, {
          user: plainUser,
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
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

  @WsEvent(MeetingSubscribeEvents.OnEndMeeting)
  async endMeeting(
    @MessageBody() message: EndMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        console.log('session', session.session.id);

        const meeting = await this.meetingsService.findById({
          id: message.meetingId,
          ...(socket && { session }),
        });

        if (!meeting) return;

        meeting.endsAt = Date.now();
        meeting.save();

        if (!socket) return;
        subscribeWsError(socket);

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
      },
      {
        onFinaly: (err) => {
          if (socket) {
            return wsError(socket, err);
          } else {
            console.log(err);
            return;
          }
        },
      },
    );
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

  @PassAuth()
  @WsEvent(MeetingSubscribeEvents.OnLeaveMeeting)
  async leaveMeeting(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: LeaveMeetingRequestDTO,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const meeting = await this.meetingsService.findById({
          id: message.meetingId,
          session,
        });

        const user = await this.usersService.findOne({
          query: { socketId: socket.id },
          session,
        });

        if (!meeting && !user) {
          return wsResult();
        }

        throwWsError(!user, MeetingNativeErrorEnum.USER_NOT_FOUND);

        const userId = user._id.toString();
        await this.usersComponent.findOneAndUpdate({
          query: {
            socketId: socket.id,
          },
          data: {
            accessStatus: MeetingAccessStatusEnum.Left,
            leaveAt: new Date()
          },
          session,
        });

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

          await this.notifyParticipantsMeetingInfo({
            meeting,
            emitToRoom: this.emitToRoom.bind(this),
          });
        }

        return wsResult();
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @PassAuth()
  @WsEvent(MeetingSubscribeEvents.OnReconnect)
  async reconnect(
    @MessageBody() msg: ReconnectDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const { meetingUserId } = msg;

        const user = await this.usersComponent.findOne({
          query: {
            _id: meetingUserId,
            accessStatus: MeetingAccessStatusEnum.Disconnected,
          },
          session,
        });

        await this.usersComponent.findMeetingFromPopulateUser(user);

        const updateData = {
          socketId: socket.id,
          accessStatus: MeetingAccessStatusEnum.InMeeting,
        };

        const userTemplate = await this.coreService.findMeetingTemplateById({
          id: user.meeting.templateId,
        });

        throwWsError(!userTemplate, 'No user template found');

        if (
          user.meetingRole !== MeetingRole.Audience &&
          user.accessStatus === MeetingAccessStatusEnum.Disconnected
        ) {
          const u = await this.usersService.updateVideoContainer({
            userTemplate,
            userId: user._id.toString(),
            event: UserActionInMeeting.Join,
          });

          Object.assign(updateData, {
            userPosition: u.position,
            userSize: u.size,
          });
        }

        const userUpdated = await this.usersComponent.findOneAndUpdate({
          query: {
            _id: meetingUserId,
          },
          data: updateData,
          session,
        });

        const meeting = await this.usersComponent.findMeetingFromPopulateUser(
          userUpdated,
        );

        const meetingUsers = await this.getMeetingUsersInRoom(meeting, session);

        await meeting.populate(['users']);
        const meetingId = meeting._id.toString();
        socket.join(`meeting:${meetingId}`);
        const plainUser = userSerialization(user);
        const plainMeeting = meetingSerialization(user.meeting);
        const plainUsers = userSerialization(meetingUsers);

        const emitMeetingData = {
          meeting: plainMeeting,
          users: plainUsers,
        };

        this.emitToRoom(
          `meeting:${meetingId}`,
          MeetingEmitEvents.UpdateMeeting,
          emitMeetingData,
        );

        this.emitToRoom(
          `meeting:${meetingId}`,
          MeetingEmitEvents.UpdateMeetingTemplate,
          { templateId: userTemplate.id },
        );

        this.emitToRoom(
          `waitingRoom:${meeting.templateId}`,
          MeetingEmitEvents.UpdateMeeting,
          emitMeetingData,
        );

        return wsResult({
          meeting: plainMeeting,
          user: plainUser,
          users: plainUsers,
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }


  @SubscribeMessage(MeetingSubscribeEvents.OnStartTranscription)
  async receiveTranscriptionResults(
    @MessageBody() message: any,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = this.getUserFromSocket(socket);
    const eventName = 'Broadcast Transcription Message';
    this.logger.log({
      message: eventName,
      ctx: message,
    });

    this.emitToRoom(
      `meeting:${user.meeting.toString()}`,
      MeetingEmitEvents.SendTranscriptionMessage,
      {
        message: {
          participant: `${user.username}`,
          transcription: `${message.note}`,
          meetingID: `${user.meeting.toString()}`,
        },
      },
    );
  }

  @Roles([MeetingRole.Host])
  @WsEvent(UsersSubscribeEvents.OnChangeHost)
  async changeHost(
    @MessageBody() message: ChangeHostDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = await this.usersComponent.findById({
          id: message.userId,
          session,
        });

        const profileUser = await this.coreService.findUserById({
          userId: user.profileId,
        });

        await user.populate([{ path: 'meeting', populate: 'hostUserId' }]);

        throwWsError(
          profileUser &&
          profileUser?.maxMeetingTime === 0 &&
          [PlanKeys.House, PlanKeys.Professional].includes(
            profileUser?.subscriptionPlanKey,
          ),
          'meeting.userHasNoTimeLeft',
        );

        const meeting = await this.meetingsService.findById({
          id: user.meeting._id,
          session,
        });

        if (user?.meeting?.hostUserId?._id) {
          const prevHostUser = await this.usersService.findById({
            id: user.meeting.hostUserId._id,
            session,
          });

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

        const newMeeting = await this.meetingsService.updateMeetingById({
          id: meeting.id,
          data: {
            hostUserId: message.userId,
          },
          session,
        });

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
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnUpdateMeeting)
  async updateMeeting(
    @MessageBody() message: UpdateMeetingRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = await this.usersComponent.findOne({
          query: { socketId: socket.id },
          session,
          populatePaths: 'meeting',
        });

        const meeting = await this.meetingsService.updateMeetingById({
          id: user?.meeting?._id,
          data: message,
          session,
        });

        const plainMeeting = meetingSerialization(meeting);
        const emitData = {
          meeting: plainMeeting,
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
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
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

  @WsEvent(VideoChatSubscribeEvents.SendOffer)
  async sendOffer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: SendOfferRequestDto,
  ): Promise<ResponseSumType<void>> {
    try {
      subscribeWsError(socket);
      this.emitToSocketId(
        message.socketId,
        VideoChatEmitEvents.GetOffer,
        message,
      );

      return wsResult();
    } catch (err) {
      return wsError(socket, err);
    }
  }

  @WsEvent(VideoChatSubscribeEvents.SendAnswer)
  async sendAnswer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: SendAnswerOfferRequestDto,
  ): Promise<ResponseSumType<void>> {
    try {
      subscribeWsError(socket);
      this.emitToSocketId(
        message.socketId,
        VideoChatEmitEvents.GetAnswer,
        message,
      );

      return;
    } catch (err) {
      return wsError(socket, err);
    }
  }

  @WsEvent(VideoChatSubscribeEvents.SendIceCandidate)
  async sendIceCandidate(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: SendIceCandidateRequestDto,
  ): Promise<ResponseSumType<void>> {
    try {
      subscribeWsError(socket);
      this.emitToSocketId(
        message.socketId,
        VideoChatEmitEvents.GetIceCandidate,
        message,
      );
      return wsResult();
    } catch (err) {
      return wsError(socket, err);
    }
  }

  @WsEvent(VideoChatSubscribeEvents.SendDevicesPermissions)
  async updateDevicesPermissions(
    @MessageBody() message: SendDevicesPermissionsRequestDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = await this.usersComponent.findOneAndUpdate({
          query: {
            _id: message.userId,
          },
          data: {
            cameraStatus: message.video ? 'active' : 'inactive',
            micStatus: message.audio ? 'active' : 'inactive',
          },
          session,
        });

        await user.populate('meeting');

        const plainUser = userSerialization(user);

        this.emitToRoom(
          `meeting:${user.meeting._id}`,
          UserEmitEvents.UpdateUser,
          {
            user: plainUser,
          },
        );
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }


  @WsEvent(MeetingSubscribeEvents.OnRequestRecording)
  async requestRecording(
    @MessageBody() msg: AudienceRequestRecording,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const { meetingId } = msg;
        const meeting = await this.meetingsService.findById({
          id: meetingId,
          session,
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        const meetingUser = await this.usersComponent.findById({ id: user._id });
        const plainUser = userSerialization(meetingUser);

        this.emitToSocketId(
          user.socketId,
          MeetingEmitEvents.ReceiveRequestRecording,
          {
            user: plainUser
          },
        );

        return wsResult({
          message: 'received request for recording',
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }
  @WsEvent(MeetingSubscribeEvents.OnRequestRecordingRejected)
  async requestRecordingRejected(
    @MessageBody() msg: AudienceRequestRecording,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const { meetingId } = msg;
        const meeting = await this.meetingsService.findById({
          id: meetingId,
          session,
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        this.emitToRoom(
          `meeting:${meeting._id.toString()}`,
          MeetingEmitEvents.ReceiveRequestRecordingRejected
        );

        return wsResult({
          message: 'rejected request for recording',
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }
  @WsEvent(MeetingSubscribeEvents.OnRequestRecordingAccepted)
  async requestRecordingAccepted(
    @MessageBody() msg: AudienceRequestRecordingAccept,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const { meetingId, recordingUrl } = msg;
        const meeting = await this.meetingsService.findById({
          id: meetingId,
          session,
        });

        await this.meetingsService.findByIdAndUpdate({
          id: meeting._id,
          data: {
            isMeetingRecordingByRequest: true,
            recordingUrl: recordingUrl
          },
          session
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        const meetingUser = await this.usersComponent.findById({ id: user._id });

        this.broadcastToRoom(
          socket,
          `meeting:${meeting._id.toString()}`,
          MeetingEmitEvents.ReceiveRequestRecordingAccepted,
          {
            username: meetingUser.username
          }
        );

        return wsResult({
          message: 'accepted request for recording',
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }
  @WsEvent(MeetingSubscribeEvents.OnStartRecordingPending)
  async startRecordingPending(
    @MessageBody() msg: AudienceRequestRecording,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const { meetingId } = msg;
        const meeting = await this.meetingsService.findById({
          id: meetingId,
          session,
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        const meetingUser = await this.usersComponent.findById({ id: user._id });

        this.broadcastToRoom(
          socket,
          `meeting:${meeting._id.toString()}`,
          MeetingEmitEvents.ReceiveStartRecordingPending,
        );

        return wsResult({
          message: 'accepted request for recording',
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }
  @WsEvent(MeetingSubscribeEvents.OnStopRecordingPending)
  async stopRecordingPending(
    @MessageBody() msg: AudienceRequestRecording,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const { meetingId } = msg;
        const meeting = await this.meetingsService.findById({
          id: meetingId,
          session,
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        this.broadcastToRoom(
          socket,
          `meeting:${meeting._id.toString()}`,
          MeetingEmitEvents.ReceiveStopRecordingPending,
        );

        return wsResult({
          message: 'accepted request for recording',
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }
  @WsEvent(MeetingSubscribeEvents.OnStartRecording)
  async startRecording(
    @MessageBody() msg: SaveRecordingUrlRequest,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const { meetingId } = msg;
        const user = this.getUserFromSocket(socket);
        const meeting = await this.meetingsService.findById({
          id: meetingId,
          session,
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        await this.meetingsService.findByIdAndUpdate({
          id: meeting._id,
          data: {
            isMeetingRecordingByRequest: true,
            isMeetingRecording: true
          },
          session
        });

        const meetingUser = await this.usersComponent.findById({ id: user._id });

        const record = await this.meetingRecordService.createMeetingRecord({ data: { meetingId: meeting._id, user: meetingUser.profileId, endAt: new Date() } });

        this.broadcastToRoom(
          socket,
          `meeting:${meetingId}`,
          MeetingEmitEvents.IsRecordingStarted,
        );

        return wsResult({
          message: record._id.toString(),
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }
  @WsEvent(MeetingSubscribeEvents.OnSaveRecordingUrl)
  async saveRecordingUrl(
    @MessageBody() msg: SaveRecordingUrlRequest,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const { id, meetingId, url } = msg;
        const user = this.getUserFromSocket(socket);
        const meeting = await this.meetingsService.findById({
          id: meetingId,
          session,
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        await this.meetingsService.findByIdAndUpdate({
          id: meeting._id,
          data: {
            isMeetingRecordingByRequest: false,
            isMeetingRecording: false
          },
          session
        });

        if (!!url) {
          const udpatedRecord = await this.meetingRecordService.findByIdAndUpdate({ id, data: { url, endAt: new Date() }, session });
          if (udpatedRecord) {
            this.emitToSocketId(
              user.socketId,
              MeetingEmitEvents.GetMeetingUrlReceive
            );

            const userProfile = await this.coreService.findUserById({ userId: user.profileId });

            const frontendUrl = await this.configService.get('frontendUrl');

            await this.notificationService.sendEmail({
              template: {
                key: emailTemplates.recordingLink,
                data: [
                  { name: 'NAME', content: user.username },
                  { name: 'LINK', content: url },
                  { name: 'PROFILEURL', content: `${frontendUrl}/dashboard/profile` },
                ],
              },
              to: [{ email: userProfile.email }],
            });
          }
        } else {
          this.emitToSocketId(
            user.socketId,
            MeetingEmitEvents.GetMeetingUrlsReceiveFail,
          );
        }

        return wsResult({
          message: 'successfully saved',
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }
  @WsEvent(MeetingSubscribeEvents.OnGetRecordingUrls)
  async getRecordingUrls(
    @MessageBody() msg: GetRecordingUrlsDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const { profileId } = msg;

        const urlModels = await this.meetingRecordService.findMany({ query: { user: profileId }, populatePaths: 'meetingId', session });
        const videos = [];

        if (!!urlModels) {
          for (let urlModel of urlModels) {
            const template = await this.coreService.findMeetingTemplateById({ id: urlModel['meetingId']['templateId'] });
            if (template) {
              videos.push({
                id: urlModel._id.toString(),
                user: urlModel.user,
                meeting: template.name || 'Anonymous',
                url: urlModel.url,
                endAt: urlModel.endAt.toString(),
                price: urlModel.price,
                createdAt: urlModel.createdAt.toString(),
                updatedAt: urlModel.updatedAt.toString()
              });
            }
          }

          this.emitToSocketId(
            socket.id,
            MeetingEmitEvents.GetMeetingUrlsReceive,
            { videos }
          );
        }

        return wsResult({
          message: 'success',
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnGetRecordingVideoById)
  async getRecordingVideoById(
    @MessageBody() msg: GetRecordingUrlById,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const { id } = msg;
        const video = await this.meetingRecordService.findById({ id, populatePaths: "meetingId", session });

        throwWsError(!video, MeetingNativeErrorEnum.MEETING_RECORDING_VIDEO_NOT_FOUND);

        const { name: meetingName } = await this.coreService.findMeetingTemplateById({ id: video['meetingId']['templateId'] });
        const host = await this.coreService.findUserById({ userId: video.user });

        return wsResult({
          message: {
            id: video._id,
            meetingName: meetingName || '',
            price: video.price,
            host: host || {},
            endAt: video.endAt.toString(),
            createdAt: video.createdAt.toString(),
            updatedAt: video.updatedAt.toString()
          },
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }
  @WsEvent(MeetingSubscribeEvents.OnGetRecordingUrlById)
  async getRecordingUrlById(
    @MessageBody() msg: GetRecordingUrlById,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const { id } = msg;
        const video = await this.meetingRecordService.findById({ id, session });

        throwWsError(!video, MeetingNativeErrorEnum.MEETING_RECORDING_VIDEO_NOT_FOUND);

        return wsResult({
          message: video.url,
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }
  @WsEvent(MeetingSubscribeEvents.OnIsMeetingRecording)
  async setIsMeetingRecording(
    @MessageBody() msg: SetIsMeetingRecordingRequest,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const { meetingId, isMeetingRecording, recordingUrl } = msg;
        const meeting = await this.meetingsService.findById({
          id: meetingId,
          session,
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        await this.meetingsService.findByIdAndUpdate({
          id: meeting._id,
          data: {
            isMeetingRecording,
            recordingUrl: recordingUrl || ''
          },
          session
        });

        return wsResult({
          message: 'successfully updated',
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnDeleteRecordingVideo)
  async deleteRecordingVideo(
    @MessageBody() msg: DeleteRecordingVideoDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const { id } = msg;
        await this.meetingRecordService.deleteById({ id }, session);

        return wsResult({
          message: 'successfully deleted',
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnUpdateRecordingVideoPrice)
  async updateRecordingVideo(
    @MessageBody() msg: UpdateRecordingVideo,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const { id, price } = msg;
        const updatedVideo = await this.meetingRecordService.findByIdAndUpdate({ id, data: { price }, session });

        await updatedVideo.populate('meetingId');

        if (!!updatedVideo) {
          const template = await this.coreService.findMeetingTemplateById({ id: updatedVideo['meetingId']['templateId'] });
          if (template) {
            const plainVideo = {
              id: updatedVideo._id.toString(),
              user: updatedVideo.user,
              meeting: template.name || 'Anonymous',
              url: updatedVideo.url,
              endAt: updatedVideo.endAt.toString(),
              price: updatedVideo.price,
              createdAt: updatedVideo.createdAt.toString(),
              updatedAt: updatedVideo.updatedAt.toString()
            };

            return wsResult({
              message: 'success',
              video: plainVideo
            });
          }
        }
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnSetDonations)
  async setDonations(
    @MessageBody() msg: SetMeetingDonations,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const { meetingId, meetingRole, price } = msg;
        const meetingDonations = await this.meetingDonationsService.findOne({
          query: { meeting: meetingId },
          session
        });
        if (meetingDonations) {
          const updateData = meetingRole === MeetingRole.Participant
            ? { participantDonations: meetingDonations.participantDonations + price }
            : meetingRole === MeetingRole.Audience
              ? { audienceDonations: meetingDonations.audienceDonations + price }
              : {};

          await this.meetingDonationsService.findOneAndUpdate({
            query: {
              meeting: new ObjectId(meetingId)
            },
            data: updateData,
            session
          });
        } else {
          const updateData = meetingRole === MeetingRole.Participant
            ? { participantDonations: price }
            : meetingRole === MeetingRole.Audience
              ? { audienceDonations: price }
              : {};

          await this.meetingDonationsService.create(updateData, session);
        }

        return wsResult({
          message: 'success'
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnPaymentPrePayment)
  async paywallPrePayment(
    @MessageBody() msg: void,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);

        await this.usersComponent.findByIdAndUpdate({ id: user._id, data: { isPaywallPaid: true }, session });

        return wsResult({
          message: 'success',
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnGeneratePrePaymentCodeRequest)
  async generatePrePaymentCode(
    @MessageBody() msg: GeneratePreEventPaymentCode,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);

        const { email, templateId } = msg;
        const user = this.getUserFromSocket(socket);

        let meeting: MeetingDocument;

        if (isValidObjectId(templateId)) {
          meeting = await this.meetingsService.findOne({
            query: { templateId },
            session
          });
        } else {
          const template = await this.coreService.findMeetingTemplate({ id: templateId });
          meeting = await this.meetingsService.findOne({
            query: {
              templateId: template.id.toString()
            },
            session
          });
        }

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        const uuid = uuidv4();
        const code = uuid.replace(/-/g, '').substring(0, 6).toUpperCase();

        await this.meetingPreEventPaymentService.create({
          meeting: meeting._id,
          email: email || '',
          code
        }, session);
        await this.usersComponent.findByIdAndUpdate({ id: user._id, data: { isPaywallPaid: true }, session });
        const meetingHost = await this.usersComponent.findById({ id: meeting.hostUserId.toString(), session });
        const template = await this.coreService.findMeetingTemplateById({ id: meeting.templateId });
        const frontendUrl = await this.configService.get('frontendUrl');

        const meetingUrl = `${frontendUrl}/room/${template.customLink || template.id
          }${user.meetingRole === MeetingRole.Audience
            ? `?role=audience&videoMute=1`
            : '?videoMute=1'
          }`;

        const date = new Date();

        const formattedDate = date.toLocaleString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'UTC'
        });

        if (email) {
          this.notificationService.sendEmail({
            template: {
              key: emailTemplates.prePaymentCode,
              data: [
                { name: 'HOSTNAME', content: meetingHost.username },
                { name: 'RUUMENAME', content: template.name },
                { name: 'CODE', content: code },
                { name: 'MEETINGURL', content: meetingUrl },
                { name: 'DATE', content: formattedDate },
                { name: 'UPDATE_PROFILE', content: frontendUrl },
                { name: 'UNSUB', content: frontendUrl },
              ],
            },
            to: [{ email: email }],
          });
        }

        return wsResult({
          message: {
            code,
            email
          },
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnCheckPrePaymentCodeRequest)
  async checkPrePaymentCode(
    @MessageBody() msg: CheckPreEventPaymentCode,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);

        const { code } = msg;

        const codeModel = await this.meetingPreEventPaymentService.findOne({
          query: { code },
          session
        });

        return wsResult({
          message: !!codeModel ? 'success' : 'fail',
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnSendAiTranscription)
  async handleAiTranscription(
    @MessageBody() msg: handleAiTranscription,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);

        const { script, currentDate } = msg;
        let scriptString = "";
        if (script.length > 0) {
          script.forEach(item => {
            scriptString += `${item.sender.username}-${item.body} | `;
          });
        }

        const frontendUrl = await this.configService.get('frontendUrl');
        const openAiApiKey = await this.configService.get('openaiApiKey');

        const prompt = `Given the following meeting transcription: 
        ** \n ${scriptString} \n**
        - From this meeting transcription, provide me the json object that contains the following fields:
        - JSON object format:
        {
          summary: Create a detailed summary(less than 1000 characters) of the meeting transcription and notes, focusing on key takeaways and action items assigned to specific individuals or departments. Use professional language and organize the summary in a logical manner using headings, subheadings, and bullet points. The summary should provide a comprehensive overview of the meeting's content, clearly indicating who is responsible for each action item. Please ensure the summary is: * Easy to understand * Succinct in length * Organized using headings and subheadings * Uses bullet points to highlight key actions * Clearly indicates who is responsible for each action item The summary should cover the essential information discussed during the meeting, including the main topics, decisions made, and tasks assigned to specific individuals or departments. ,
          transcription: ""
        }
        - If there is no given transcription, return { summary: 'No transcription', transcription: '' }.
        `;

        const openai = new OpenAI({ apiKey: openAiApiKey });
        const params: OpenAI.Chat.ChatCompletionCreateParams = {
          messages: [{ role: 'user', content: prompt }],
          model: 'gpt-3.5-turbo',
          response_format: { "type": "json_object" }
        };
        const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
        let messageContent = chatCompletion.choices[0].message.content;

        if (messageContent) {
          // const now = new Date();
          // const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

          // const date = now.getDate();
          // const month = months[now.getMonth()];
          // const year = now.getFullYear();
          // const hours = now.getHours();
          // const minutes = now.getMinutes();
          // const ampm = hours >= 12 ? 'pm' : 'am';

          // const formattedDateTime = `${month} ${date}, ${year}, ${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${ampm} (${timeZone})`;

          const userProfile = await this.coreService.findUserById({ userId: user.profileId });

          const parsedContent = JSON.parse(messageContent);

          let summary = parsedContent.summary || 'No summary';
          // let transcription = parsedContent.transcription || 'No transcription';
          let transcription = scriptString || 'No transcription';

          const attachmentContent = 'Summary\n\n\n' + summary + '\n\n\nTranscript\n\n\n ' + transcription.replace(/-/g, ": ").replace(/ \|/g, "\n").trim();

          if (transcription.length > 1000) {
            transcription = transcription.slice(0, transcription.slice(0, 1000).lastIndexOf('|')) + "<br>...</br>( Please refer to the attachment for the completed transcription. )";
          }

          transcription = transcription.replace(/-/g, ": ").replace(/ \|/g, "<br>").trim();

          if (messageContent && userProfile) {
            await this.notificationService.sendEmail({
              template: {
                key: emailTemplates.aiSummary,
                data: [
                  { name: 'NAME', content: user.username },
                  { name: 'DATE', content: currentDate },
                  { name: 'SUMMARY', content: summary },
                  { name: 'TRANSCRIPTION', content: transcription },
                  { name: 'PROFILEURL', content: `${frontendUrl}/dashboard/profile` },
                ],
              },
              to: [{ email: userProfile.email }],
              attachmentContent
            });
          }
        }

        return wsResult({
          message: 'success'
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnIsAiTranscriptionOn)
  async handleIsAiTranscriptionOn(
    @MessageBody() msg: void,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);

        const user = this.getUserFromSocket(socket);
        const meetingInstance = await this.meetingsService.findById({
          id: user.meeting.toString(),
          session,
        });
        console.log(meetingInstance);

        throwWsError(!meetingInstance, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        this.broadcastToRoom(
          socket,
          `meeting:${meetingInstance._id}`,
          MeetingEmitEvents.ReceiveAiTranscriptionOn,
        );

        return wsResult({
          message: 'success',
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }
}


