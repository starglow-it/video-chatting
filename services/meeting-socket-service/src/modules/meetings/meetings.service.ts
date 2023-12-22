import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Meeting, MeetingDocument } from '../../schemas/meeting.schema';
import { MeetingUserDocument } from '../../schemas/meeting-user.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { CustomPopulateOptions } from '../../types';
import { GetModelByIdQuery, UpdateModelByIdQuery } from 'src/types/mongoose';
@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(Meeting.name) private meeting: Model<MeetingDocument>,
  ) {}

  private logger = new Logger(MeetingsService.name);

  async createMeeting(
    data: any,
    { session }: ITransactionSession,
  ): Promise<MeetingDocument> {
    const [meeting] = await this.meeting.create([data], { session });

    return meeting;
  }

  async findOne(
    query: any,
    { session }: ITransactionSession,
  ): Promise<MeetingDocument> {
    return this.meeting.findOne(query, {}, { session }).exec();
  }

  async findById({
    id,
    session,
    populatePaths,
  }: GetModelByIdQuery<MeetingDocument>): Promise<MeetingDocument> {
    return this.meeting
      .findById(id, {}, { populate: populatePaths, session: session?.session })
      .exec();
  }

  async addUserToMeeting(
    {
      meetingId,
      userId,
    }: {
      meetingId: MeetingDocument['id'];
      userId: MeetingUserDocument['_id'];
    },
    { session }: ITransactionSession,
  ) {
    return this.meeting
      .findByIdAndUpdate(
        meetingId,
        { $push: { users: userId } },
        { session, new: true },
      )
      .exec();
  }

  async removeUserFromMeeting(
    {
      userId,
    }: {
      userId: MeetingUserDocument['_id'];
    },
    { session }: ITransactionSession,
  ) {
    return this.meeting
      .findOneAndUpdate(
        { users: userId },
        { $pull: { users: userId } },
        { new: true },
      )
      .session(session);
  }

  async deleteById(
    { meetingId },
    { session }: ITransactionSession,
  ): Promise<void> {
    await this.meeting.deleteOne({ _id: meetingId }).session(session);

    return;
  }

  async updateMeetingById({
    id,
    data,
    session = null,
  }: UpdateModelByIdQuery<MeetingDocument>): Promise<MeetingDocument> {
    return this.meeting
      .findByIdAndUpdate(id, data, {
        session: session?.session,
        new: true,
      })
      .exec();
  }

  async findByIdAndUpdate(
    meetingId,
    data,
    { session }: ITransactionSession,
  ): Promise<MeetingDocument> {
    return this.meeting
      .findByIdAndUpdate(meetingId, data, {
        session,
        new: true,
      })
      .exec();
  }
}
