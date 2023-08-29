import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { IMeetingAvatar } from 'shared-types';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import {
  MeetingAvatar,
  MeetingAvatarDocument,
} from '../../schemas/meeting-avatar.schema';
import { GetModelQuery, UpdateModelQuery } from '../../types/custom';

@Injectable()
export class MeetingAvatarsService {
  constructor(
    @InjectModel(MeetingAvatar.name)
    private meetingAvatar: Model<MeetingAvatarDocument>,
  ) {}

  async createMany({
    data,
    session,
  }: {
    data: Partial<MeetingAvatarDocument>[];
    session?: ITransactionSession;
  }) {
    const avatars = await this.meetingAvatar.insertMany(data, {
      session: session?.session,
    });

    return avatars;
  }

  async create({
    data,
    session,
  }: {
    data: Partial<MeetingAvatarDocument>;
    session?: ITransactionSession;
  }): Promise<MeetingAvatarDocument> {
    const [newAvatar] = await this.meetingAvatar.create([data], {
      session: session?.session,
    });
    return newAvatar;
  }

  async find({
    query,
    options,
    session,
    populatePaths,
  }: GetModelQuery<MeetingAvatarDocument>) {
    return this.meetingAvatar
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

  async update({
    query,
    data,
    session,
    populatePaths,
  }: UpdateModelQuery<
    MeetingAvatarDocument,
    IMeetingAvatar
  >): Promise<MeetingAvatarDocument> {
    return this.meetingAvatar.findOneAndUpdate(query, data, {
      session: session?.session,
      populate: populatePaths,
      new: true,
    });
  }

  async count(query: FilterQuery<MeetingAvatarDocument>): Promise<number> {
    return this.meetingAvatar.count(query).exec();
  }

  async deleteMany({
    query,
    session,
  }: {
    query: FilterQuery<MeetingAvatarDocument>;
    session?: ITransactionSession;
  }): Promise<any> {
    return this.meetingAvatar.deleteMany(query, {
      session: session?.session,
    });
  }
}
