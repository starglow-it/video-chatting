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
import { MeetingReactionsService } from '../modules/meeting-reactions/meeting-reactions.service';
import { MeetingQuestionAnswersService } from '../modules/meeting-question-answer/meeting-question-answer.service';
import { CoreService } from '../services/core/core.service';

// dtos
import { UpdateUserRequestDTO } from '../dtos/requests/users/update-user.dto';
import { userSerialization } from '../dtos/response/common-user.dto';
import { RemoveUserRequestDTO } from '../dtos/requests/users/remove-user.dto';
import { meetingSerialization } from '../dtos/response/common-meeting.dto';
import { GetStatisticsDTO } from '../dtos/requests/users/get-statistics-dto';
import { SendRequestToHostWhenDnd } from '../dtos/requests/send-request-to-host-when-dnd';

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
    private meetingReactionsService: MeetingReactionsService,
    private coreService: CoreService,
    private meetingQuestionAnswersService: MeetingQuestionAnswersService,
    private readonly usersComponent: UsersComponent,
    @InjectConnection() private connection: Connection,
  ) {
    super();
  }

  private async updateVideoContainer({
    userTemplateId,
    user,
    data,
  }: {
    userTemplateId: string;
    user: MeetingUserDocument;
    data: Partial<MeetingUserDocument>;
    session: ITransactionSession;
  }) {
    const usersTemplate = await this.coreService.findMeetingTemplateById({
      id: userTemplateId,
    });

    const updateUsersPosistion = usersTemplate.usersPosition;
    const updateUsersSize = usersTemplate.usersSize;

    const index = usersTemplate.indexUsers.indexOf(user._id.toString());
    throwWsError(index <= -1, MeetingNativeErrorEnum.USER_NOT_FOUND);

    if (data?.userPosition) {
      user.userPosition = data.userPosition;

      updateUsersPosistion[index] = data.userPosition;
    }

    if (data?.userSize) {
      user.userSize = data.userSize;
      updateUsersSize[index] = data.userSize;
    }

    user.save();

    this.coreService.updateUserTemplate({
      templateId: userTemplateId,
      userId: user._id.toString(),
      data: {
        usersPosition: updateUsersPosistion,
        usersSize: updateUsersSize,
      },
    });
  }

  private dateFormat = (value) => {
    let date = new Date(value);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    // Get components
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const timezoneOffsetInMinutes = date.getTimezoneOffset();
    const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffsetInMinutes / 60));
    const timezoneOffsetMinutes = Math.abs(timezoneOffsetInMinutes % 60);
    const timezoneSign = timezoneOffsetInMinutes > 0 ? '-' : '+';
    const timezone = `UTC${timezoneSign}${timezoneOffsetHours}:${String(timezoneOffsetMinutes).padStart(2, '0')}`;

    const formattedDate = `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm} ${timezone}`;

    return formattedDate;
  };

  @WsEvent(UsersSubscribeEvents.OnUpdateUser)
  async updateUser(
    @MessageBody() message: UpdateUserRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
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

        if (user.meetingRole !== MeetingRole.Audience && user.accessStatus === MeetingAccessStatusEnum.InMeeting) {
          await this.updateVideoContainer({
            userTemplateId: meeting.templateId,
            user,
            data: {
              userPosition: message?.userPosition,
              userSize: message?.userSize,
            },
            session,
          });
        }

        await meeting.populate('users');

        const plainUser = userSerialization(user);

        let plainUsers = userSerialization(meeting.users);
        plainUsers = Array.from(new Set(plainUsers.map(item => item.id)))
          .map(id => plainUsers.find(item => item.id === id));

        this.emitToRoom(`meeting:${user.meeting}`, UserEmitEvents.UpdateUsers, {
          users: plainUsers.map((user) => ({
            ...user,
            ...(message.userSize &&
              message.id == user.id && { userSize: message.userSize }),
            ...(message.userPosition &&
              message.id == user.id && { userPosition: message.userPosition }),
          })),
        });

        if (!user.doNotDisturb) {
          this.emitToRoom(`waitingRoom:${meeting.templateId}`, UserEmitEvents.UpdateUsers, {
            users: plainUsers.map((user) => ({
              ...user,
              ...(message.userSize &&
                message.id == user.id && { userSize: message.userSize }),
              ...(message.userPosition &&
                message.id == user.id && { userPosition: message.userPosition }),
            })),
          });
        }

        return wsResult({
          user: {
            ...plainUser,
            userPosition: {
              ...plainUser.userPosition,
              ...(message.userSize && { userSize: message?.userSize }),
            },
          },
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(UsersSubscribeEvents.OnGetStatistics)
  async getStatistics(
    @MessageBody() message: GetStatisticsDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        const { profileId } = message;
        let meetingLinks = [];
        let meetingNames = [];
        subscribeWsError(socket);

        const meetings = await this.meetingsService.findMany({
          query: {
            ownerProfileId: profileId
          },
          populatePaths: 'templateId',
          session,
          sort: { startAt: 'desc' },
        });

        throwWsError(!meetings, MeetingNativeErrorEnum.MEETING_NOT_FOUND);
        let validMeetings = [];
        if (meetings.length > 0) {
          for (const meeting of meetings) {
            let meetingInstance = {
              id: meeting._id,
              name: 'Anonymous',
              startedAt: meeting.startAt ? this.dateFormat(meeting.startAt) : ""
            };
            try {

              const template = await this.coreService.findMeetingTemplateById({ id: meeting.templateId });

              if (template) {
                meetingInstance.name = template.name
                validMeetings.push(meeting);
                meetingNames.push(meetingInstance);
              }

            } catch (error) {
              console.error("Error finding meeting template:", error);
            }
          }
          if (validMeetings.length > 0) {
            const meeting = await this.meetingsService.findById({
              id: message.meetingId || validMeetings[0]['_id'],
              session,
            });
            throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

            const { users } = await meeting.populate('users');
            const participants = users.filter(user => user.meetingRole === 'participant');
            const audiences = users.filter(user => user.meetingRole === 'audience');

            const totalParticipants = participants.length;
            const totalAudiences = audiences.length;

            const participantJoinTimes = participants.map(user => user.joinedAt);
            const audienceJoinTimes = audiences.map(user => user.joinedAt);

            const participantAverageJoinTime = participantJoinTimes.reduce((acc, curr) => acc + curr, 0) / totalParticipants;
            const audienceAverageJoinTime = audienceJoinTimes.reduce((acc, curr) => acc + curr, 0) / totalAudiences;

            const participantLeaveTimes = participants.map(user => user.leaveAt);
            const audienceLeaveTimes = audiences.map(user => user.leaveAt);
            const participantAverageLeaveTime = participantLeaveTimes.reduce((acc, curr) => acc + curr, 0) / totalParticipants;
            const audienceAverageLeaveTime = audienceLeaveTimes.reduce((acc, curr) => acc + curr, 0) / totalAudiences;

            const participantAverageMeetingTime = totalParticipants !== 0 ? (participantAverageLeaveTime - participantAverageJoinTime) / (1000 * 60) : 0;
            const audienceAverageMeetingTime = totalAudiences !== 0 ? (audienceAverageLeaveTime - audienceAverageJoinTime) / (1000 * 60) : 0;
            const attendeesData = {
              totalParticipants,
              totalAudiences,
              participantAverageMeetingTime: participantAverageMeetingTime > 1
                ? Math.floor(participantAverageMeetingTime)
                : participantAverageMeetingTime <= 0
                  ? 0
                  : 1,
              audienceAverageMeetingTime: audienceAverageMeetingTime > 1
                ? Math.floor(audienceAverageMeetingTime)
                : audienceAverageMeetingTime <= 0
                  ? 0
                  : 1,
            };

            if (meeting.links && meeting.links.length > 0) {

              meetingLinks = meeting.links.map(link => {
                return {
                  url: link.url,
                  clicks: link.users.length,
                  clickThroughRate: link.users.length > 0 ? ((link.users.length / (totalParticipants + totalAudiences)) * 100).toFixed(1) : 0
                };
              });
            }
            //get Locations
            const countriesMap = new Map<string, { count: number, states?: Map<string, number> }>();

            for (const user of users) {
              if (user.meetingRole !== MeetingRole.Host && user.meetingRole !== MeetingRole.Recorder) {
                let country = "Other";
                let state: string | undefined;

                if (user.country) {
                  country = user.country;
                  if (["Canada", "United States"].includes(country) && user.state) {
                    state = user.state;
                  }
                }

                const countryInfo = countriesMap.get(country) || { count: 0, states: new Map<string, number>() };
                countriesMap.set(country, countryInfo);
                countryInfo.count++;

                if (state) {
                  const stateCount = countryInfo.states?.get(state) || 0;
                  countryInfo.states?.set(state, stateCount + 1);
                }
              }
            }
            const countriesArray = Array.from(countriesMap).map(([country, countryInfo]) => ({
              country,
              count: countryInfo.count,
              ...(countryInfo.states && { states: Array.from(countryInfo.states).map(([state, count]) => ({ state, count })) })
            }));

            const reactionData = await this.meetingReactionsService.getReactionStats(meeting._id);

            const reactions = {
              total: 0,
              participants: 0,
              audiences: 0,
              reactions: []
            };
            if (reactionData) {
              reactions.total = reactionData.reduce((total, reaction) => total + reaction.totalReactions, 0);
              reactions.participants = reactionData.reduce((total, reaction) => total + reaction.participantsNum, 0);
              reactions.audiences = reactionData.reduce((total, reaction) => total + reaction.audienceNum, 0);
              reactions.reactions = reactionData;
            }

            const qaData = await this.meetingQuestionAnswersService.findMany({
              query: {
                meeting: meeting._id
              },
              populatePaths: 'sender',
              session
            });

            let qaStatistics = {};
            if (qaData) {
              qaStatistics = qaData.map(data => {
                return {
                  content: data.body,
                  who: data.sender.username,
                  answered: data.reactions.size !== 0
                };
              });
            }
            const { templatePayments } = await this.coreService.findTemplatePayment({
              userTemplateId: meeting.templateId,
              userId: profileId
            });

            let monetization = {
              participantEntryFee: 0,
              audienceEntryFee: 0,
              participantFees: 0,
              audienceFees: 0,
              donations: 0
            };
            const donatedParticipants = participants.filter(participant => participant.isDonated).length;
            const donatedAudiences = audiences.filter(audience => audience.isDonated).length;

            if (templatePayments.length > 0) {
              templatePayments.forEach(templatePayment => {
                if (templatePayment.type === 'paywall') {
                  if (templatePayment.meetingRole === MeetingRole.Participant) {
                    monetization.participantEntryFee = templatePayment.price;
                    monetization.participantFees = templatePayment.price * totalParticipants;
                  }

                  if (templatePayment.meetingRole === MeetingRole.Audience) {
                    monetization.audienceEntryFee = templatePayment.price;
                    monetization.audienceFees = templatePayment.price * totalAudiences;
                  }
                }

                if (templatePayment.type === 'meeting') {
                  if (templatePayment.meetingRole === MeetingRole.Participant) {
                    monetization.donations += templatePayment.price * donatedParticipants;
                  }

                  if (templatePayment.meetingRole === MeetingRole.Audience) {
                    monetization.donations += templatePayment.price * donatedAudiences;
                  }
                }
              });
            }
            const result = {
              meetingNames,
              attendeesData,
              countriesArray,
              reactions,
              qaStatistics,
              meetingLinks,
              monetization,
            };

            this.emitToSocketId(socket.id, UserEmitEvents.MeetingStatistics, result);
            return wsResult({
              attendeesData,
              countriesArray,
              reactions,
              qaStatistics,
              meetingNames,
              meetingLinks,
              monetization
            });
          }
        }
        if (meetings.length == 0 || validMeetings.length == 0) {
          this.emitToSocketId(socket.id, UserEmitEvents.MeetingStatistics, null);
          return wsResult(null);
        }
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @Roles([MeetingRole.Host])
  @WsEvent(UsersSubscribeEvents.OnRemoveUser)
  async removeUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: RemoveUserRequestDTO,
  ): Promise<ResponseSumType<void>> {
    return withTransaction(
      this.connection,
      async (session) => {
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
          `waitingRoom:${meetingUpdated.templateId}`,
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
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(UsersSubscribeEvents.OnSendRequestToHostWhenDnd)
  async sendRequestToHostWhenDnd(
    @MessageBody() msg: SendRequestToHostWhenDnd,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const { meetingId, username } = msg;
        const meeting = await this.meetingsService.findById({
          id: meetingId,
          session,
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        await this.usersComponent.findByIdAndUpdate(
          {
            id: user._id,
            data: {
              username: username,
              accessStatus: MeetingAccessStatusEnum.RequestSentWhenDnd
            },
            session
          });

        await meeting.populate('users');

        let plainUsers = userSerialization(meeting.users);
        plainUsers = Array.from(new Set(plainUsers.map(item => item.id)))
          .map(id => plainUsers.find(item => item.id === id));

        this.emitToRoom(`meeting:${user.meeting}`, UserEmitEvents.UpdateUsers, {
          users: plainUsers
        });

        return wsResult({
          message: 'success'
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }
}
