import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  MeetingInstance,
  MeetingInstanceDocument,
} from '../schemas/meeting-instance.schema';

import { ITransactionSession } from '../helpers/mongo/withTransaction';
import { ConfigClientService } from '../config/config.service';
import { ICreateMeetingDTO } from '@shared/interfaces/create-meeting.interface';
import { ICommonMeetingInstanceDTO } from '@shared/interfaces/common-instance-meeting.interface';

@Injectable()
export class MeetingsService {
  constructor(
    private configService: ConfigClientService,
    @InjectModel(MeetingInstance.name)
    private meetingInstance: Model<MeetingInstanceDocument>,
  ) {}

  async create(
    createMeetingData: ICreateMeetingDTO,
    { session }: ITransactionSession,
  ): Promise<MeetingInstanceDocument> {
    const defaultServerIp = await this.configService.get('defaultServerIp');

    const [meeting] = await this.meetingInstance.create(
      [
        {
          owner: createMeetingData.userId,
          serverIp: createMeetingData.serverIp ?? defaultServerIp,
          template: createMeetingData.templateId,
        },
      ],
      { session },
    );

    return meeting;
  }

  async findById(
    getMeetingData: { meetingId: ICommonMeetingInstanceDTO['id'] },
    { session }: ITransactionSession,
  ): Promise<MeetingInstanceDocument> {
    return this.meetingInstance
      .findById(getMeetingData.meetingId)
      .session(session);
  }
}
