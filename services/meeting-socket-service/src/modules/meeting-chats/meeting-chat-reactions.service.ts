import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InsertModelQuery,
  DeleteModelQuery,
  GetModelSingleQuery,
  GetModelMultipleQuery,
  UpdateModelSingleQuery,
} from '../../types/mongoose';
import {
  MeetingChatReaction,
  MeetingChatReactionDocument,
} from '../../schemas/meeting-chat-reaction.schema';

@Injectable()
export class MeetingChatReactionsService {
  constructor(
    @InjectModel(MeetingChatReaction.name)
    private meetingChatReaction: Model<MeetingChatReactionDocument>,
  ) {}

  async create({
    data,
    session: { session },
  }: InsertModelQuery<MeetingChatReaction>) {
    const [meetingChat] = await this.meetingChatReaction.create([data], {
      session,
    });
    return meetingChat;
  }

  async deleteMany({
    query,
    session: { session },
  }: DeleteModelQuery<MeetingChatReactionDocument>): Promise<void> {
    await this.meetingChatReaction.deleteMany(query, { session });
    return;
  }

  async findOne({
    query,
    session: { session },
  }: GetModelSingleQuery<MeetingChatReactionDocument>) {
    return this.meetingChatReaction.findOne(query, {}, { session }).exec();
  }

  async findOneAndUpdate({
    query,
    data,
    session: { session },
  }: UpdateModelSingleQuery<MeetingChatReactionDocument>) {
    return this.meetingChatReaction.findOneAndUpdate(query, data, {
      new: true,
      session,
    });
  }

  async deleteOne({
    query,
    session: { session },
  }: DeleteModelQuery<MeetingChatReactionDocument>): Promise<void> {
    await this.meetingChatReaction.deleteOne(query, { session }).exec();
    return;
  }


  async findMany({
    query,
    options,
    session,
    populatePaths,
  }: GetModelMultipleQuery<MeetingChatReactionDocument>) {
    return this.meetingChatReaction
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
