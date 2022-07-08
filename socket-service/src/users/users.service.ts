import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import {
  MeetingUser,
  MeetingUserDocument,
} from '../schemas/meeting-user.schema';
import { ITransactionSession } from '../helpers/mongo/withTransaction';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(MeetingUser.name)
    private meetingUser: Model<MeetingUserDocument>,
  ) {}

  async createUser(
    data: any,
    { session }: ITransactionSession,
  ): Promise<MeetingUserDocument> {
    const [user] = await this.meetingUser.create([data], { session });

    return user;
  }

  async updateOne(
    query,
    data,
    { session }: ITransactionSession,
  ): Promise<UpdateWriteOpResult> {
    return this.meetingUser.updateOne(query, data, { new: true, session });
  }

  async findOne(
    query,
    { session }: ITransactionSession,
  ): Promise<MeetingUserDocument> {
    return this.meetingUser.findOne(query, {}, { session });
  }

  async countMany(query) {
    return this.meetingUser.find(query).count().exec();
  }

  async findById(
    id: string,
    { session }: ITransactionSession,
  ): Promise<MeetingUserDocument> {
    return this.meetingUser.findById(id, {}, { session });
  }

  async findOneAndUpdate(
    query,
    data: Partial<MeetingUserDocument>,
    { session }: ITransactionSession,
  ): Promise<MeetingUserDocument> {
    return this.meetingUser.findOneAndUpdate(query, data, {
      new: true,
      session,
    });
  }

  async findByIdAndUpdate(
    id,
    data,
    { session }: ITransactionSession,
  ): Promise<MeetingUserDocument> {
    return this.meetingUser.findByIdAndUpdate(id, data, { new: true, session });
  }

  async deleteUser(query, { session }: ITransactionSession) {
    return this.meetingUser.deleteOne(query, { session });
  }

  async deleteMany(query, { session }: ITransactionSession) {
    return this.meetingUser.deleteMany(query, { session });
  }

  async findUsers(query, { session }: ITransactionSession) {
    return this.meetingUser.find(query, {}, { session }).exec();
  }
}
