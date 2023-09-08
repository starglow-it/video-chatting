import { Injectable } from '@nestjs/common';
import { getTimeoutTimestamp } from '../../utils/getTimeoutTimestamp';
import {
  ICommonUser,
  IUserTemplate,
  MeetingAccessStatusEnum,
  PlanKeys,
  TimeoutTypesEnum,
} from 'shared-types';
import { CoreService } from '../../services/core/core.service';
import { MeetingTimeService } from '../meeting-time/meeting-time.service';
import {
  ITransactionSession,
  withTransaction,
} from '../../helpers/mongo/withTransaction';
import { MeetingsService } from './meetings.service';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';
import { MeetingDocument } from '../../schemas/meeting.schema';
import { userSerialization } from '../../dtos/response/common-user.dto';
import { WsException } from '@nestjs/websockets';
import { MeetingEmitEvents } from '../../const/socket-events/emitters';
import { TEventEmitter } from '../../types/socket-events';
import { meetingSerialization } from '../../dtos/response/common-meeting.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Socket } from 'socket.io';
import { MeetingUserDocument } from '../../schemas/meeting-user.schema';

@Injectable()
export class MeetingsCommonService {
  constructor(
    private meetingHostTimeService: MeetingTimeService,
    private meetingsService: MeetingsService,
    private coreService: CoreService,
    private taskService: TasksService,
    private usersService: UsersService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async handleTimeLimit({
    profileId,
    meetingUserId,
    meetingId,
    session,
    maxProfileTime,
  }: {
    profileId: string;
    meetingUserId: string;
    meetingId: string;
    maxProfileTime: number;
    session: ITransactionSession;
  }) {
    const hostTimeData = await this.meetingHostTimeService.find({
      query: {
        host: meetingUserId,
        meeting: meetingId,
        endAt: null,
      },
      session,
    });

    const maxTimeToExtract = getTimeoutTimestamp({
      value: 90,
      type: TimeoutTypesEnum.Minutes,
    });

    const timeToExtract = hostTimeData.reduce(
      (acc, b) =>
        acc +
        ((b.endAt ?? Date.now()) - b.startAt > maxTimeToExtract
          ? maxTimeToExtract
          : (b.endAt ?? Date.now()) - b.startAt),
      0,
    );

    await this.coreService.updateUser({
      query: { _id: profileId },
      data: {
        maxMeetingTime:
          timeToExtract > maxProfileTime ? 0 : maxProfileTime - timeToExtract,
      },
    });
  }

  async handleClearMeetingData({
    templateId,
    userId,
    instanceId,
    meetingId,
    session,
  }) {
    await this.usersService.deleteMany({ meeting: meetingId }, session);

    await this.meetingsService.deleteById({ meetingId }, session);

    await this.coreService.updateMeetingInstance({
      instanceId,
      data: {
        owner: null,
      },
    });

    await this.coreService.updateUserTemplate({
      templateId,
      userId,
      data: { meetingInstance: null },
    });
  }

  async changeUsersPositions({
    meetingId,
    templateId,
    event,
    session,
    emitToRoom,
  }: {
    meetingId: string;
    templateId: string;
    event: string;
    session: ITransactionSession;
    emitToRoom: (...args: TEventEmitter) => void;
  }): Promise<void> {
    try {
      const template = await this.coreService.findMeetingTemplateById({
        id: templateId,
      });

      const usersTemplate = await this.coreService.findMeetingTemplateById({
        id: templateId,
      });

      usersTemplate.indexUsers.forEach(async (userId, i) => {
        const user = await this.usersService.findById(userId);
        if (!user) return;

        const userPosition = template?.usersPosition?.[i];
        const userSize = template?.usersSize?.[i];

        user.userPosition = userPosition;
        user.userSize = userSize;

        user.save();
      });

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

      if (!updatedMeeting) return;
      const plainUsers = userSerialization(meetingUsers);
      const plainMeeting = meetingSerialization(updatedMeeting);

      emitToRoom(`waitingRoom:${templateId}`, MeetingEmitEvents.UpdateMeeting, {
        meeting: plainMeeting,
        users: plainUsers,
      });

      emitToRoom(
        `meeting:${plainMeeting.id}`,
        MeetingEmitEvents.UpdateMeeting,
        {
          meeting: plainMeeting,
          users: plainUsers,
        },
      );
    } catch (err) {
      console.error({
        message: err.message,
        event,
      });
      return;
    }
  }

  compareActiveWithMaxParicipants = async (meeting: MeetingDocument) => {
    const c = await this.usersService.countMany({
      meeting: meeting._id,
      accessStatus: MeetingAccessStatusEnum.InMeeting,
    });

    if (c === meeting.maxParticipants) return;
    return c;
  };

  checkCurrentUserPlain = (user: ICommonUser) => {
    return ![PlanKeys.Business, PlanKeys.House, PlanKeys.Professional].includes(
      user.subscriptionPlanKey,
    );
  };

  acceptUserJoinRoom = async ({
    userId,
    session,
    meeting,
    template,
  }: {
    userId: string;
    session: ITransactionSession;
    meeting: MeetingDocument;
    template: IUserTemplate;
  }) => {
    try {
      const user = await this.usersService.findById(userId, session);

      if (!user) return;

      const usersTemplate = await this.coreService.findMeetingTemplateById({
        id: meeting.templateId,
      });

      const indexUser = usersTemplate.indexUsers.indexOf(null);
      if (indexUser === -1) return;

      const updatedUser = await this.usersService.findOneAndUpdate(
        {
          _id: userId,
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

      usersTemplate.indexUsers[indexUser] = user.id.toString();

      await this.coreService.updateUserTemplate({
        templateId: usersTemplate.id,
        userId: user.id.toString(),
        data: {
          indexUsers: usersTemplate.indexUsers,
        },
      });

      return userSerialization(updatedUser);
    } catch (err) {
      throw new WsException(err);
    }
  };

  rejectUserJoinRoom = async ({
    userId,
    session,
    emitToSocketId,
  }: {
    userId: string;
    emitToSocketId: (...args: TEventEmitter) => void;
    session: ITransactionSession;
  }) => {
    try {
      const user = await this.usersService.findByIdAndUpdate(
        userId,
        {
          accessStatus: MeetingAccessStatusEnum.Rejected,
        },
        session,
      );

      if (!user) {
        throw new WsException({
          message: 'User not found',
        });
      }

      const r = userSerialization(user);

      emitToSocketId(user.socketId, MeetingEmitEvents.ReceiveAccessRequest, {
        user: r,
      });

      emitToSocketId(user.socketId, MeetingEmitEvents.SendMeetingError, {
        message: 'meeting.requestDenied',
      });

      return r;
    } catch (err) {
      throw new WsException({
        message: err.message,
      });
    }
  };

  handleDisconnectWithHaveParticipants = async ({
    isMeetingHost,
    meeting,
    endsAt,
    event,
    client,
    emitToRoom,
    callback,
  }: {
    isMeetingHost: boolean;
    meeting: MeetingDocument;
    endsAt: number;
    event: string;
    client: Socket;
    emitToRoom: (...args: TEventEmitter) => void;
    callback: () => void;
  }) => {
    const meetingId = meeting._id.toString();
    if (isMeetingHost) {
      const endTimestamp = getTimeoutTimestamp({
        type: TimeoutTypesEnum.Minutes,
        value: 15,
      });

      console.log('timeout', endTimestamp);

      const meetingEndTime = (endsAt || Date.now()) - Date.now();

      this.taskService.deleteTimeout({
        name: `meeting:finish:${meetingId}`,
      });

      this.taskService.addTimeout({
        name: `meeting:finish:${meetingId}`,
        ts: meetingEndTime > endTimestamp ? endTimestamp : meetingEndTime,
        callback,
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
        return withTransaction(
          this.connection,
          async (session: ITransactionSession) => {
            try {
              this.changeUsersPositions({
                meetingId,
                templateId: meeting.templateId,
                emitToRoom,
                event,
                session,
              });
            } catch (err) {
              console.error({
                mesage: err.mesage,
                ctx: client.id,
              });
              return;
            }
          },
        );
      },
    });
  };

  handleUserLoggedInDisconnect = async ({
    user,
    timeToAdd,
    isMeetingHost,
    session,
    meetingId,
  }: {
    user: MeetingUserDocument;
    timeToAdd: number;
    isMeetingHost: boolean;
    session: ITransactionSession;
    meetingId: string;
  }) => {
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

        if (isMeetingHost && this.checkCurrentUserPlain(profileUser)) {
          await this.handleTimeLimit({
            profileId: profileUser.id,
            meetingId,
            meetingUserId: user._id.toString(),
            maxProfileTime: profileUser.maxMeetingTime,
            session,
          });
        }
      }
    } catch (err) {
      throw new WsException({
        message: err.message,
      });
    }
  };
}
