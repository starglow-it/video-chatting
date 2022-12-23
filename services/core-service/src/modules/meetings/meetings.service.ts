import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import {
  MeetingInstance,
  MeetingInstanceDocument,
} from '../../schemas/meeting-instance.schema';

import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { IMeetingInstance } from 'shared-types';
import { GetModelQuery, UpdateModelQuery } from '../../types/custom';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(MeetingInstance.name)
    private meetingInstance: Model<MeetingInstanceDocument>,
  ) {}

  async create({
    data,
    session,
  }: {
    data: UpdateQuery<MeetingInstanceDocument>;
    session: ITransactionSession;
  }): Promise<MeetingInstanceDocument> {
    const [meeting] = await this.meetingInstance.create([data], {
      session: session?.session,
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
    data: { meetingId: IMeetingInstance['id'] },
    { session }: ITransactionSession,
  ): Promise<MeetingInstanceDocument> {
    return this.meetingInstance
      .findById(data.meetingId, {}, { session })
      .exec();
  }

  async find({
    query,
    session,
  }: GetModelQuery<MeetingInstanceDocument>): Promise<
    MeetingInstanceDocument[]
  > {
    return this.meetingInstance
      .find(query, {}, { session: session.session })
      .exec();
  }

  async update({
    query,
    data,
    session,
  }: UpdateModelQuery<MeetingInstanceDocument, MeetingInstanceDocument>) {
    return this.meetingInstance
      .findOneAndUpdate(query, data, { new: true, session: session?.session })
      .exec();
  }
}
