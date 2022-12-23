import { Injectable } from '@nestjs/common';
import { getTimeoutTimestamp } from '../../utils/getTimeoutTimestamp';
import { TimeoutTypesEnum } from 'shared-types';
import { CoreService } from '../../services/core/core.service';
import { MeetingTimeService } from '../meeting-time/meeting-time.service';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { MeetingsService } from './meetings.service';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class MeetingsCommonService {
  constructor(
    private meetingHostTimeService: MeetingTimeService,
    private meetingsService: MeetingsService,
    private coreService: CoreService,
    private taskService: TasksService,
    private usersService: UsersService,
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

  async handleClearMeetingData({ templateId, userId, instanceId, meetingId, session }) {
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
      data: { meetingInstance: null }
    });
  }
}
