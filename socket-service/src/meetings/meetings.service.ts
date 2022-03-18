import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Meeting, MeetingDocument } from '../schemas/meeting.schema';
import { MeetingUserDocument } from '../schemas/meeting-user.schema';
import { ITransactionSession } from '../helpers/mongo/withTransaction';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(Meeting.name) private meeting: Model<MeetingDocument>,
  ) {}

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
    return this.meeting.findOne(query).session(session);
  }

  async findById(
    id: string,
    { session }: ITransactionSession,
  ): Promise<MeetingDocument> {
    return this.meeting.findById(id).session(session);
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
      .findByIdAndUpdate(meetingId, { $push: { users: userId } }, { new: true })
      .session(session);
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

  async deleteById({ meetingId }, { session }: ITransactionSession) {
    return this.meeting.deleteOne({ id: meetingId }).session(session);
  }

  async updateMeetingById(
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

  async findByIdAndUpdate(meetingId, data, { session }: ITransactionSession) {
    return this.meeting.findByIdAndUpdate(meetingId, data, {
      session,
      new: true,
    });
  }
}
