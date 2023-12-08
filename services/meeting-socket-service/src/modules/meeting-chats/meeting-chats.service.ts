import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MeetingChat,
  MeetingChatDocument,
} from '../../schemas/meeting-chat.schema';
import {
  InsertModelSingleQuery,
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

  async create({ data, session = null }: InsertModelSingleQuery<MeetingChat>) {
    const [meetingChat] = await this.meetingChat.create([data], {
      session: session?.session,
    });
    return meetingChat;
  }

  async deleteMany({
    query,
    session = null,
  }: DeleteModelQuery<MeetingChat>): Promise<void> {
    await this.meetingChat.deleteMany(query, { session: session?.session });
    return;
  }

  async findOne({
    query,
    session = null,
  }: GetModelSingleQuery<MeetingChatDocument>) {
    return this.meetingChat
      .findOne(query, {}, { session: session?.session })
      .exec();
  }

  async findOneAndUpdate({
    query,
    data,
    session = null,
  }: UpdateModelSingleQuery<MeetingChatDocument>) {
    return this.meetingChat.findOneAndUpdate(query, data, {
      new: true,
      session: session?.session,
    });
  }

  async deleteOne({
    query,
    session = null,
  }: DeleteModelQuery<MeetingChatDocument>): Promise<void> {
    await this.meetingChat
      .deleteOne(query, { session: session?.session })
      .exec();
    return;
  }

  async findMany({
    query,
    options,
    session = null,
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
