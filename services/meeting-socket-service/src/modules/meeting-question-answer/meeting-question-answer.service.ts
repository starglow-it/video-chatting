import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MeetingQuestionAnswer,
  MeetingQuestionAnswerDocument,
} from '../../schemas/meeting-question-answer.schema';
import {
  InsertModelSingleQuery,
  DeleteModelQuery,
  GetModelSingleQuery,
  GetModelMultipleQuery,
  UpdateModelSingleQuery,
} from '../../types/mongoose';

@Injectable()
export class MeetingQuestionAnswersService {
  constructor(
    @InjectModel(MeetingQuestionAnswer.name)
    private readonly meetingQuestionAnswer: Model<MeetingQuestionAnswerDocument>,
  ) { }

  async create({ data, session = null }: InsertModelSingleQuery<MeetingQuestionAnswer>) {
    const [meetingQuestionAnswer] = await this.meetingQuestionAnswer.create([data], {
      session: session?.session,
    });
    return meetingQuestionAnswer;
  }

  async deleteMany({
    query,
    session = null,
  }: DeleteModelQuery<MeetingQuestionAnswer>): Promise<void> {
    await this.meetingQuestionAnswer.deleteMany(query, { session: session?.session });
    return;
  }

  async findOne({
    query,
    session = null,
  }: GetModelSingleQuery<MeetingQuestionAnswerDocument>) {
    return this.meetingQuestionAnswer
      .findOne(query, {}, { session: session?.session })
      .exec();
  }

  async findOneAndUpdate({
    query,
    data,
    session = null,
  }: UpdateModelSingleQuery<MeetingQuestionAnswerDocument>) {
    return this.meetingQuestionAnswer.findOneAndUpdate(query, data, {
      new: true,
      session: session?.session,
    });
  }

  async deleteOne({
    query,
    session = null,
  }: DeleteModelQuery<MeetingQuestionAnswerDocument>): Promise<void> {
    await this.meetingQuestionAnswer
      .deleteOne(query, { session: session?.session })
      .exec();
    return;
  }

  async findMany({
    query,
    options,
    session = null,
    populatePaths,
  }: GetModelMultipleQuery<MeetingQuestionAnswerDocument>) {
    return this.meetingQuestionAnswer
      .find(
        query,
        {},
        {
          skip: options?.skip,
          limit: options?.limit,
          session: session?.session,
          populate: populatePaths,
        },
      )
      .exec();
  }

  async getDocumentCounts(meetingId: string): Promise<{
    totalDocuments: number, reactedDocuments: number, documentsWithReactions: { body: string, username: string }[]
  }> {
    const pipeline = [
      { $match: { meeting: meetingId } },
      {
        $group:
        {
          _id: null, totalDocuments: { $sum: 1 },
          reactedDocuments: { $sum: { $cond: { if: { $gt: [{ $size: "$reactions" }, 0] }, then: 1, else: 0 } } }
        }
      },
      { $project: { _id: 0, totalDocuments: 1, reactedDocuments: 1 } }
    ];

    const result = await this.meetingQuestionAnswer.aggregate(pipeline);

    let documentsWithReactions: { body: string, username: string }[] = [];

    if (result.length > 0) {
      documentsWithReactions = await this.meetingQuestionAnswer.aggregate([
        { $match: { meeting: meetingId, reactions: { $exists: true, $ne: new Map() } } },
        { $unwind: "$reactions" },
        { $unwind: "$reactions.v" },
        { $lookup: { from: 'meetingusers', localField: 'reactions.v', foreignField: '_id', as: 'user' } },
        { $unwind: "$user" },
        { $project: { _id: 0, body: 1, username: "$user.username" } }
      ]);
    }

    return {
      totalDocuments: result.length > 0 ? result[0].totalDocuments : 0,
      reactedDocuments: result.length > 0 ? result[0].reactedDocuments : 0,
      documentsWithReactions
    };
  }
}