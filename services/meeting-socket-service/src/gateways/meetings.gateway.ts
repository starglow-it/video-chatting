import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { Socket } from 'socket.io';
import axios from 'axios';

import { BaseGateway } from './base.gateway';

import { MeetingQuestionAnswersService } from '../modules/meeting-question-answer/meeting-question-answer.service';
import { MeetingsService } from '../modules/meetings/meetings.service';
import { UsersService } from '../modules/users/users.service';
import { TasksService } from '../modules/tasks/tasks.service';
import { CoreService } from '../services/core/core.service';
import { MeetingRecordService } from '../modules/meeting-record/meeting-record.service';
import { MeetingRecordCommonService } from '../modules/meeting-record/meeting-record.common';

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
import { MeetingI18nErrorEnum, MeetingNativeErrorEnum } from 'shared-const';
import { WsEvent } from '../utils/decorators/wsEvent.decorator';
import { TEventEmitter } from 'src/types/socket-events';
import { WsBadRequestException } from '../exceptions/ws.exception';
import { LeaveMeetingRequestDTO } from '../dtos/requests/leave-meeting.dto';
import { AudienceRequestRecording } from 'src/dtos/requests/audience-request-recording.dto';
import { SaveRecordingUrlRequest } from 'src/dtos/requests/save-recordingurl.dto';
import { AudienceRequestRecordingAccept } from 'src/dtos/requests/audience-request-recording-accept.dto';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class MeetingsGateway
  extends BaseGateway
  implements OnGatewayDisconnect {
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
        const waitingRoom = `waitingRoom:${message.templateId}`;
        const rejoinRoom = `rejoin:${message.templateId}`;
        this.joinRoom(socket, waitingRoom);
        this.leaveRoom(socket, rejoinRoom);

        const template = await this.coreService.findMeetingTemplateById({
          id: message.templateId,
        });

        throwWsError(!template, 'No template found');

        let meeting = await this.meetingsService.findOne({
          query: {
            templateId: message.templateId,
          },
          session,
        });

        const links = !!template.links
          ? template.links.map(link => ({
            url: link.item,
            users: []
          }))
          : null;

        if (message.meetingRole == MeetingRole.Host && !meeting) {
          meeting = await this.meetingsService.createMeeting({
            data: {
              isMonetizationEnabled: false,
              mode: 'together',
              ownerProfileId: message.profileId,
              maxParticipants: message.maxParticipants,
              templateId: message.templateId,
              links
            },
            session,
          });
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

        if (
          message.meetingRole == MeetingRole.Host &&
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

        meeting.users.push(user.id);
        meeting.save();

        const meetingUsers = await this.getMeetingUsersInRoom(meeting, session);

        const plainMeeting = meetingSerialization(meeting);
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

        const user = this.getUserFromSocket(socket);

        const u = await this.usersService.updateVideoContainer({
          userTemplate: template,
          userId: user._id.toString(),
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

        this.emitToRoom(
          `meeting:${meeting._id.toString()}`,
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
  @WsEvent(MeetingSubscribeEvents.OnSaveRecordingUrl)
  async saveRecordingUrl(
    @MessageBody() msg: SaveRecordingUrlRequest,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const { meetingId, url } = msg;
        const user = this.getUserFromSocket(socket);
        const meeting = await this.meetingsService.findById({
          id: meetingId,
          session,
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        await this.meetingsService.findByIdAndUpdate({
          id: meeting._id,
          data: {
            isMeetingRecordingByRequest: false
          },
          session
        });

        const meetingUser = await this.usersComponent.findById({ id: user._id });

        if (!!url) {
          await this.meetingRecordService.createMeetingRecord({ data: { meetingId: meeting._id, url } });
          const urlDocuments = await this.meetingRecordService.findMany({ query: { meetingId: meeting._id }, session });
          const urls = urlDocuments.map(doc => doc.url);

          this.emitToRoom(
            `meeting:${meeting._id.toString()}`,
            MeetingEmitEvents.GetMeetingUrlsReceive,
            { user: meetingUser.username, urls }
          );
        } else {
          this.emitToRoom(
            `meeting:${meeting._id.toString()}`,
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
        const user = this.getUserFromSocket(socket);
        const meeting = await this.meetingsService.findById({
          id: meetingId,
          session,
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        await this.meetingsService.findByIdAndUpdate({
          id: meeting._id,
          data: {
            isMeetingRecording,
            recordingUrl
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
}
