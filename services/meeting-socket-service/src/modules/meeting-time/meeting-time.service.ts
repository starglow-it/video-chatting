import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import {
  MeetingHostTime,
  MeetingHostTimeDocument,
} from '../../schemas/meeting-time.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';

@Injectable()
export class MeetingTimeService {
  constructor(
    @InjectModel(MeetingHostTime.name)
    private meetingHostTime: Model<MeetingHostTimeDocument>,
  ) {}

  async create({
    data,
    session,
  }: {
    data: any;
    session?: ITransactionSession;
  }) {
    return this.meetingHostTime.create([data], { session: session?.session });
  }

  async update({
    query,
    data,
    session,
  }: {
    query: FilterQuery<MeetingHostTimeDocument>;
    data: UpdateQuery<MeetingHostTimeDocument>;
    session?: ITransactionSession;
  }) {
    return this.meetingHostTime
      .findOneAndUpdate(query, data, {
        session: session?.session,
        new: true,
      })
      .exec();
  }

  async find({
    query,
    session,
  }: {
    query: FilterQuery<MeetingHostTimeDocument>;
    session?: ITransactionSession;
  }) {
    return this.meetingHostTime
      .find(query, {}, { session: session?.session })
      .exec();
  }
}
