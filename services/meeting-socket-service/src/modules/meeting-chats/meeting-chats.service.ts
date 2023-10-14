import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MeetingChat,
  MeetingChatDocument,
} from '../../schemas/meeting-chat.schema';
import {
  InsertModelQuery,
  DeleteModelQuery,
  GetModelSingleQuery,
  GetModelMultipleQuery,
  UpdateModelSingleQuery,
} from '../../types/mongoose';

@Injectable()
export class MeetingChatsService {
  constructor(
    @InjectModel(MeetingChat.name)
    private meetingChat: Model<MeetingChatDocument>,
  ) {}

  async create({ data, session: { session } }: InsertModelQuery<MeetingChat>) {
    const [meetingChat] = await this.meetingChat.create([data], { session });
    return meetingChat;
  }

  async deleteMany({
    query,
    session: { session },
  }: DeleteModelQuery<MeetingChat>): Promise<void> {
    await this.meetingChat.deleteMany(query, { session });
    return;
  }

  async findOne({
    query,
    session: { session },
  }: GetModelSingleQuery<MeetingChatDocument>) {
    return this.meetingChat.findOne(query, {}, { session }).exec();
  }

  async findOneAndUpdate({
    query,
    data,
    session: { session },
  }: UpdateModelSingleQuery<MeetingChatDocument>) {
    return this.meetingChat.findOneAndUpdate(query, data, {
      new: true,
      session,
    });
  }

  async deleteOne({
    query,
    session: { session },
  }: DeleteModelQuery<MeetingChatDocument>): Promise<void> {
    await this.meetingChat.deleteOne(query, { session }).exec();
    return;
  }

  async findMany({
    query,
    options,
    session,
    populatePaths,
  }: GetModelMultipleQuery<MeetingChatDocument>) {
    return this.meetingChat
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
