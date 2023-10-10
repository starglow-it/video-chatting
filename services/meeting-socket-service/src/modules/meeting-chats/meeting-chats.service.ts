import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITransactionSession } from 'src/helpers/mongo/withTransaction';
import {
  MeetingChat,
  MeetingChatDocument,
} from 'src/schemas/meeting-chat.schema';
import {
  InsertModelQuery,
  GetModelQuery,
  DeleteModelQuery,
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

  async deleteOne({
    query,
    session: { session },
  }: DeleteModelQuery<MeetingChat>): Promise<void> {
    await this.meetingChat.deleteOne(query, { session }).exec();
    return;
  }

  async findMany({
    query,
    options,
    session,
    populatePaths,
  }: GetModelQuery<MeetingChatDocument>) {
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
