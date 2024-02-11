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
import { getUsersDTO } from '../dtos/requests/users/get-users.dto';
import { GetStatisticsDTO } from '../dtos/requests/users/get-statistics-dto';
import { userSerialization } from '../dtos/response/common-user.dto';
import { RemoveUserRequestDTO } from '../dtos/requests/users/remove-user.dto';
import { meetingSerialization } from '../dtos/response/common-meeting.dto';

import { MeetingQuestionAnswersService } from '../modules/meeting-question-answer/meeting-question-answer.service';

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

        await this.updateVideoContainer({
          userTemplateId: meeting.templateId,
          user,
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
        subscribeWsError(socket);

        const meetings = await this.meetingsService.findMany({
          query: {
            ownerProfileId: profileId
          },
          session
        });

        throwWsError(!meetings, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        const meeting = await this.meetingsService.findById({
          id: !!message.meetingId || meetings.length && meetings[0]['_id'],
          session,
        });

        throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

        const { users } = await meeting.populate('users');

        const participants = users.filter(user => user.meetingRole === 'participant');
        const audiences = users.filter(user => user.meetingRole === 'audience');

        const totalParticipants = participants.length;
        const totalAudience = audiences.length;

        const participantJoinTimes = participants.map(user => user.joinedAt);
        const audienceJoinTimes = audiences.map(user => user.joinedAt);

        const participantAverageJoinTime = participantJoinTimes.reduce((acc, curr) => acc + curr, 0) / totalParticipants;
        const audienceAverageJoinTime = audienceJoinTimes.reduce((acc, curr) => acc + curr, 0) / totalAudience;

        const participantLeaveTimes = participants.map(user => user.leaveAt);
        const audienceLeaveTimes = audiences.map(user => user.leaveAt);

        const participantAverageLeaveTime = participantLeaveTimes.reduce((acc, curr) => acc + curr, 0) / totalParticipants;
        const audienceAverageLeaveTime = audienceLeaveTimes.reduce((acc, curr) => acc + curr, 0) / totalAudience;

        const participantAverageMeetingTime = totalParticipants !== 0 ? (participantAverageLeaveTime - participantAverageJoinTime) / (1000 * 60) : 0;
        const audienceAverageMeetingTime = totalAudience !== 0 ? (audienceAverageLeaveTime - audienceAverageJoinTime) / (1000 * 60) : 0;

        const attendeesData = {
          totalParticipants,
          totalAudience,
          participantAverageMeetingTime,
          audienceAverageMeetingTime,
        };

        console.log('attendeesData +++++++++++++');
        console.log(attendeesData);

        //get Locations
        const countriesMap = new Map<string, { count: number, states?: Map<string, number> }>();

        for (const user of users) {
          
          const profileId = user.profileId;
          const profile = !!profileId ? await this.coreService.findUserById({ userId: profileId }) : { country: '', state: '' };

          let country = "Other";
          let state: string | undefined;

          if (profile && profile.country) {
            country = profile.country;
            if (["Canada", "United States"].includes(country) && profile.state) {
              state = profile.state;
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

        const countriesArray = Array.from(countriesMap).map(([country, countryInfo]) => ({
          country,
          count: countryInfo.count,
          ...(countryInfo.states && { states: Array.from(countryInfo.states).map(([state, count]) => ({ state, count })) })
        }));

        const qaStatistics = await this.meetingQuestionAnswersService.getDocumentCounts(meeting._id);

        console.log('++++++');
        console.log({
          attendeesData,
          countriesArray,
          qaStatistics
        });

        return wsResult({
          totalParticipants,
          totalAudience,
          participantAverageMeetingTime,
          audienceAverageMeetingTime,
        });
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
}
