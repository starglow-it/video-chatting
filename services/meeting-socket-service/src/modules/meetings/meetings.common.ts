import { Injectable, Logger } from '@nestjs/common';
import { getTimeoutTimestamp } from '../../utils/getTimeoutTimestamp';
import {
  ICommonUser,
  MeetingAccessStatusEnum,
  PlanKeys,
  TimeoutTypesEnum,
} from 'shared-types';
import { CoreService } from '../../services/core/core.service';
import { MeetingTimeService } from '../meeting-time/meeting-time.service';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { MeetingsService } from './meetings.service';
import { UsersService } from '../users/users.service';
import { MeetingDocument } from '../../schemas/meeting.schema';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MeetingUserDocument } from '../../schemas/meeting-user.schema';
import { MeetingChatsService } from '../meeting-chats/meeting-chats.service';
import { MeetingChatReactionsService } from '../meeting-chats/meeting-chat-reactions.service';

@Injectable()
export class MeetingsCommonService {
  private logger: Logger = new Logger(MeetingsCommonService.name);
  constructor(
    private meetingHostTimeService: MeetingTimeService,
    private meetingsService: MeetingsService,
    private coreService: CoreService,
    private usersService: UsersService,
    private readonly meetingChatsService: MeetingChatsService,
    private readonly meetingChatReactionsService: MeetingChatReactionsService,
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
    await this.meetingChatReactionsService.deleteMany({
      query: { meeting: meetingId },
      session,
    });

    await this.meetingChatsService.deleteMany({
      query: { meeting: meetingId },
      session,
    });
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

  compareActiveWithMaxParicipants = async (
    meeting: MeetingDocument,
    role: 'lurker' | 'participant',
  ) => {
    const c = await this.usersService.countMany({
      meeting: meeting._id,
      accessStatus: {
        $in: [MeetingAccessStatusEnum.InMeeting],
      },
      meetingRole: role,
    });

    if (role === 'participant') {
      if (c === meeting.maxParticipants) return;
    } else if (role === 'lurker') {
      if (c >= 1000) return;
    }

    return c;
  };

  checkCurrentUserPlain = (user: ICommonUser) => {
    return ![PlanKeys.Business, PlanKeys.House, PlanKeys.Professional].includes(
      user.subscriptionPlanKey,
    );
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
    let profileUser = null;
    if (!user.profileId) return;
    profileUser = await this.coreService.findUserById({
      userId: user.profileId,
    });

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
  };
}
