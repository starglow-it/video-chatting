import { Injectable } from '@nestjs/common';
import { getTimeoutTimestamp } from '../../utils/getTimeoutTimestamp';
import {
  ICommonUser,
  MeetingAccessStatusEnum,
  MeetingRole,
  PlanKeys,
  TimeoutTypesEnum,
} from 'shared-types';
import { CoreService } from '../../services/core/core.service';
import { MeetingTimeService } from '../meeting-time/meeting-time.service';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { MeetingsService } from './meetings.service';
import { UsersService } from '../users/users.service';
import { MeetingDocument } from '../../schemas/meeting.schema';
import { MeetingUserDocument } from '../../schemas/meeting-user.schema';
import { MeetingChatsService } from '../meeting-chats/meeting-chats.service';
import { MeetingChatReactionsService } from '../meeting-chats/meeting-chat-reactions.service';
import { MeetingReactionsService } from '../meeting-reactions/meeting-reactions.service';
import { MeetingQuestionAnswersService } from '../meeting-question-answer/meeting-question-answer.service';
import { MeetingQuestionAnswerReactionsService } from '../meeting-question-answer/meeting-question-answer-reactions.service';

@Injectable()
export class MeetingsCommonService {
  constructor(
    private meetingHostTimeService: MeetingTimeService,
    private meetingsService: MeetingsService,
    private coreService: CoreService,
    private usersService: UsersService,
    private readonly meetingChatsService: MeetingChatsService,
    private readonly meetingReactionsService: MeetingReactionsService,
    private readonly meetingChatReactionsService: MeetingChatReactionsService,
    private readonly meetingQuestionAnswersService: MeetingQuestionAnswersService,
    private readonly meeetingQuestionAnswerReactionsService: MeetingQuestionAnswerReactionsService,
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

  async clearMeeting({
    meetingId,
    session,
  }: {
    meetingId: string;
    session: ITransactionSession;
  }) {
    await this.meetingChatReactionsService.deleteMany({
      query: { meeting: meetingId },
      session,
    });

    await this.meetingReactionsService.deleteMany({
      query: { meeting: meetingId },
      session,
    });

    await this.meeetingQuestionAnswerReactionsService.deleteMany({
      query: { meeting: meetingId },
      session,
    });

    await this.meetingChatsService.deleteMany({
      query: { meeting: meetingId },
      session,
    });

    await this.meetingQuestionAnswersService.deleteMany({
      query: { meeting: meetingId },
      session,
    });
    await this.usersService.deleteMany({ meeting: meetingId, accessStatus: { $ne: MeetingAccessStatusEnum.Waiting } }, session);

    // await this.meetingsService.deleteById({ meetingId }, session);
  }

  async handleClearMeetingData({
    templateId,
    userId,
    instanceId,
    meetingId,
    session,
  }) {
    await this.clearMeeting({ meetingId, session });
    // await this.coreService.updateMeetingInstance({
    //   instanceId,
    //   data: {
    //     owner: null,
    //   },
    // });
    await this.coreService.updateUserTemplate({
      templateId,
      userId,
      data: { meetingInstance: null },
    });
  }

  private getMembersQuantity = async (
    meeting: MeetingDocument,
    roles: MeetingRole[],
  ) => {
    return await this.usersService.countMany({
      meeting: meeting._id,
      accessStatus: {
        $in: [MeetingAccessStatusEnum.InMeeting],
      },
      meetingRole: {
        $in: roles,
      },
    });
  };

  isMaxMembers = async (meeting: MeetingDocument, role: MeetingRole) => {
    const condition =
      role === MeetingRole.Audience
        ? { max: 1000, roles: [MeetingRole.Audience] }
        : {
            max: meeting.maxParticipants,
            roles: [MeetingRole.Host, MeetingRole.Participant],
          };

    const count = await this.getMembersQuantity(meeting, condition.roles);

    return count >= condition.max;
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
