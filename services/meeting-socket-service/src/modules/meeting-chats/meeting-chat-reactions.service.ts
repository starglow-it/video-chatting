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
    session = null,
  }: InsertModelSingleQuery<MeetingChatReaction>) {
    const [meetingChat] = await this.meetingChatReaction.create([data], {
      session: session?.session,
    });
    return meetingChat;
  }

  async deleteMany({
    query,
    session = null,
  }: DeleteModelQuery<MeetingChatReactionDocument>): Promise<void> {
    await this.meetingChatReaction.deleteMany(query, {
      session: session?.session,
    });
    return;
  }

  async findOne({
    query,
    session = null,
  }: GetModelSingleQuery<MeetingChatReactionDocument>) {
    return this.meetingChatReaction
      .findOne(query, {}, { session: session?.session })
      .exec();
  }

  async findOneAndUpdate({
    query,
    data,
    session = null,
  }: UpdateModelSingleQuery<MeetingChatReactionDocument>) {
    return this.meetingChatReaction.findOneAndUpdate(query, data, {
      new: true,
      session: session?.session,
    });
  }

  async deleteOne({
    query,
    session = null,
  }: DeleteModelQuery<MeetingChatReactionDocument>): Promise<void> {
    await this.meetingChatReaction
      .deleteOne(query, { session: session?.session })
      .exec();
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
