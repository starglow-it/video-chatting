import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  MeetingReaction,
  MeetingReactionDocument,
} from '../../schemas/meeting-reaction.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';

import {
  DeleteModelQuery,
  GetModelMultipleQuery,
} from '../../types/mongoose';

@Injectable()
export class MeetingReactionsService {
  constructor(
    @InjectModel(MeetingReaction.name)
    private meetingReaction: Model<MeetingReactionDocument>,
  ) { }

  async create(data, { session }: ITransactionSession) {
    return this.meetingReaction.create([data], { session });
  }

  async deleteOne(query, { session }: ITransactionSession): Promise<void> {
    await this.meetingReaction.deleteOne(query, { session });

    return;
  }

  async deleteMany({
    query,
    session = null,
  }: DeleteModelQuery<MeetingReactionDocument>): Promise<void> {
    await this.meetingReaction.deleteMany(query, { session: session?.session });
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

  async getReactionStats(meetingId: string): Promise<any> {
    const objectIdMeetingId = new Types.ObjectId(meetingId);

    const reactionsPipeline = [
      { $match: { meeting: objectIdMeetingId } },
      {
        $lookup: {
          from: 'meetingusers',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: { emojiName: '$emojiName', meetingRole: '$user.meetingRole' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.emojiName',
          reactions: {
            $push: {
              meetingRole: '$_id.meetingRole',
              count: '$count',
            },
          },
          totalReactions: { $sum: '$count' },
          participantsNum: {
            $sum: {
              $cond: [{ $eq: ['$_id.meetingRole', 'participant'] }, '$count', 0],
            },
          },
          audienceNum: {
            $sum: {
              $cond: [{ $eq: ['$_id.meetingRole', 'audience'] }, '$count', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          reactionName: '$_id',
          totalReactions: 1,
          participantsNum: 1,
          audienceNum: 1,
        },
      },
    ];

    const reactionsStats = await this.meetingReaction.aggregate(reactionsPipeline);

    return reactionsStats;
  }
}
