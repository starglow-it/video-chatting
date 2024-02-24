import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MeetingRecord, MeetingRecordDocument } from '../../schemas/meeting-record.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import {
  GetModelByIdQuery,
  GetModelSingleQuery,
  GetModelMultipleQuery,
  InsertModelQuery,
  UpdateModelByIdQuery,
} from '../../types/mongoose';

@Injectable()
export class MeetingRecordService {
  constructor(
    @InjectModel(MeetingRecord.name) private meetingRecordModel: Model<MeetingRecordDocument>,
  ) { }

  async createMeetingRecord({
    data,
    session,
  }: InsertModelQuery<MeetingRecordDocument>): Promise<MeetingRecordDocument> {
    const meetingRecord = await this.meetingRecordModel.create([data], {
      session: session?.session,
    });

    return meetingRecord[0];
  }

  async findOne({
    query,
    populatePaths,
    session,
  }: GetModelSingleQuery<MeetingRecordDocument>): Promise<MeetingRecordDocument> {
    return this.meetingRecordModel.findOne(
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
  }: GetModelMultipleQuery<MeetingRecordDocument>): Promise<MeetingRecordDocument[]> {
    return this.meetingRecordModel.find(
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
  }: GetModelByIdQuery<MeetingRecordDocument>): Promise<MeetingRecordDocument> {
    const meetingRecord = await this.meetingRecordModel.findById(
      id, {}, { populate: populatePaths, session: session?.session }
    ).exec();

    return meetingRecord;
  }

  async deleteById(
    { id },
    { session }: ITransactionSession,
  ): Promise<void> {
    await this.meetingRecordModel.deleteOne({ _id: id }).session(session);
  }

  async deleteMany({
    query,
    session,
  }: {
    query: FilterQuery<MeetingRecordDocument>;
    session?: ITransactionSession;
  }): Promise<void> {
    await this.meetingRecordModel.deleteMany(query).session(session?.session);
  }

  async findByIdAndUpdate({
    id,
    data,
    populatePaths,
    session,
  }: UpdateModelByIdQuery<MeetingRecordDocument>): Promise<MeetingRecordDocument> {
    const meetingRecord = await this.meetingRecordModel.findByIdAndUpdate(id, data, {
      new: true,
      populate: populatePaths,
      session: session?.session,
    }).exec();

    return meetingRecord;
  }
}
