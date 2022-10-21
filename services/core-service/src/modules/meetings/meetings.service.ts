import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import {
  MeetingInstance,
  MeetingInstanceDocument,
} from '../../schemas/meeting-instance.schema';

import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { ICommonMeetingInstance } from 'shared';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(MeetingInstance.name)
    private meetingInstance: Model<MeetingInstanceDocument>,
  ) {}

  async create(
    createMeetingData: UpdateQuery<MeetingInstanceDocument>,
    { session }: ITransactionSession,
  ): Promise<MeetingInstanceDocument> {
    const [meeting] = await this.meetingInstance.create([createMeetingData], {
      session,
    });

    return meeting;
  }

  async deleteMeeting({
    query,
    session,
  }: {
    query: FilterQuery<MeetingInstanceDocument>;
    session: ITransactionSession;
  }): Promise<void> {
    await this.meetingInstance.deleteOne(query, { session: session?.session });

    return;
  }

  async findById(
    getMeetingData: { meetingId: ICommonMeetingInstance['id'] },
    { session }: ITransactionSession,
  ): Promise<MeetingInstanceDocument> {
    return this.meetingInstance
      .findById(getMeetingData.meetingId, {}, { session })
      .exec();
  }

  async find({
    query,
    session,
  }: {
    query: FilterQuery<MeetingInstanceDocument>;
    session: ITransactionSession;
  }) {
    return this.meetingInstance
      .find(query, {}, { session: session.session })
      .exec();
  }

  async update({
    query,
    data,
    session,
  }: {
    query: FilterQuery<MeetingInstanceDocument>;
    data: UpdateQuery<MeetingInstanceDocument>;
    session: ITransactionSession;
  }) {
    return this.meetingInstance
      .findOneAndUpdate(query, data, { new: true, session: session?.session })
      .exec();
  }
}
