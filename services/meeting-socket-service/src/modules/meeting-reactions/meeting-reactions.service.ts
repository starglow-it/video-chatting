import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  MeetingReaction,
  MeetingReactionDocument,
} from '../../schemas/meeting-reaction.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { GetModelMultipleQuery } from 'src/types/mongoose';

@Injectable()
export class MeetingReactionsService {
  constructor(
    @InjectModel(MeetingReaction.name)
    private meetingReaction: Model<MeetingReactionDocument>,
  ) {}

  async create(data, { session }: ITransactionSession) {
    return this.meetingReaction.create([data], { session });
  }

  async deleteOne(query, { session }: ITransactionSession): Promise<void> {
    await this.meetingReaction.deleteOne(query, { session });

    return;
  }

  async findMany({
    query,
    populatePaths,
    session = null,
  }: GetModelMultipleQuery<MeetingReactionDocument>) {
    return this.meetingReaction
      .find(query, {}, { session: session?.session, populate: populatePaths })
      .exec();
  }
}
