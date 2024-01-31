import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DeleteModelQuery,
  GetModelSingleQuery,
  GetModelMultipleQuery,
  UpdateModelSingleQuery,
  InsertModelSingleQuery,
} from '../../types/mongoose';
import {
  MeetingQuestionAnswerReaction,
  MeetingQuestionAnswerReactionDocument,
} from '../../schemas/meeting-question-answer-reaction.schema';

@Injectable()
export class MeetingQuestionAnswerReactionsService {
  constructor(
    @InjectModel(MeetingQuestionAnswerReaction.name)
    private meetingQuestionAnswerReaction: Model<MeetingQuestionAnswerReactionDocument>,
  ) {}

  async create({
    data,
    session = null,
  }: InsertModelSingleQuery<MeetingQuestionAnswerReaction>) {
    const [meetingQuestionAnswer] = await this.meetingQuestionAnswerReaction.create([data], {
      session: session?.session,
    });
    return meetingQuestionAnswer;
  }

  async deleteMany({
    query,
    session = null,
  }: DeleteModelQuery<MeetingQuestionAnswerReactionDocument>): Promise<void> {
    await this.meetingQuestionAnswerReaction.deleteMany(query, {
      session: session?.session,
    });
    return;
  }

  async findOne({
    query,
    session = null,
  }: GetModelSingleQuery<MeetingQuestionAnswerReactionDocument>) {
    return this.meetingQuestionAnswerReaction
      .findOne(query, {}, { session: session?.session })
      .exec();
  }

  async findOneAndUpdate({
    query,
    data,
    session = null,
  }: UpdateModelSingleQuery<MeetingQuestionAnswerReactionDocument>) {
    return this.meetingQuestionAnswerReaction.findOneAndUpdate(query, data, {
      new: true,
      session: session?.session,
    });
  }

  async deleteOne({
    query,
    session = null,
  }: DeleteModelQuery<MeetingQuestionAnswerReactionDocument>): Promise<void> {
    await this.meetingQuestionAnswerReaction
      .deleteOne(query, { session: session?.session })
      .exec();
    return;
  }

  async findMany({
    query,
    options,
    session,
    populatePaths,
  }: GetModelMultipleQuery<MeetingQuestionAnswerReactionDocument>) {
    return this.meetingQuestionAnswerReaction
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
}
