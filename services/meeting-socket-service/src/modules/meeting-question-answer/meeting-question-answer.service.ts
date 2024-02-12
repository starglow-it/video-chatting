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
}