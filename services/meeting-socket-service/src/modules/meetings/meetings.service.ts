import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Meeting, MeetingDocument } from '../../schemas/meeting.schema';
import { MeetingUserDocument } from '../../schemas/meeting-user.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import {
  GetModelByIdQuery,
  GetModelSingleQuery,
  GetModelMultipleQuery,
  InsertModelQuery,
  UpdateModelByIdQuery,
} from '../../types/mongoose';
@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(Meeting.name) private meeting: Model<MeetingDocument>,
  ) { }

  async createMeeting({
    data,
    session,
  }: InsertModelQuery<MeetingDocument>): Promise<MeetingDocument> {
    const [meeting] = await this.meeting.create([data], {
      session: session?.session,
    });

    return meeting;
  }

  async findOne({
    query,
    populatePaths,
    session,
  }: GetModelSingleQuery<MeetingDocument>): Promise<MeetingDocument> {
    return this.meeting
      .findOne(
        query,
        {},
        { session: session?.session, populate: populatePaths },
      )
      .exec();
  }

  async findMany({
    query,
    populatePaths,
    session,
    sort,
  }: GetModelMultipleQuery<MeetingDocument>): Promise<MeetingDocument[]> {
    return this.meeting
      .find(
        query,
        {},
        { session: session?.session, populate: populatePaths, sort: sort },
      )
      .exec();
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

  async findByIdAndUpdate({
    id,
    data,
    populatePaths,
    session,
  }: UpdateModelByIdQuery<MeetingDocument>): Promise<MeetingDocument> {
    return this.meeting
      .findByIdAndUpdate(id, data, {
        session: session?.session,
        populate: populatePaths,
        new: true,
      })
      .exec();
  }
}
