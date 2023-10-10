import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MeetingChat,
  MeetingChatDocument,
} from 'src/schemas/meeting-chat.schema';
import {
  InsertModelQuery,
  GetModelQuery,
  DeleteModelQuery,
} from '../../types/mongoose';
import {
  MeetingChatReaction,
  MeetingChatReactionDocument,
} from 'src/schemas/meeting-chat-reaction.schema';

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
    const [meetingChat] = await this.meetingChatReaction.create([data], { session });
    return meetingChat;
  }

  async deleteOne({
    query,
    session: { session },
  }: DeleteModelQuery<MeetingChatReaction>): Promise<void> {
    await this.meetingChatReaction.deleteOne(query, { session }).exec();
    return;
  }

  async findMany({
    query,
    options,
    session,
    populatePaths,
  }: GetModelQuery<MeetingChatDocument>) {
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

  async deleteMany({
    query,
    session: { session },
  }: DeleteModelQuery<MeetingChatReaction>): Promise<void> {
    await this.meetingChatReaction.deleteMany(query, { session });
    return;
  }
}
