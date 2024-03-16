import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  MeetingDonations,
  MeetingDonationsDocument,
} from '../../schemas/meeting-donations.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { GetModelMultipleQuery, UpdateModelSingleQuery, GetModelSingleQuery } from 'src/types/mongoose';

@Injectable()
export class MeetingDonationsService {
  constructor(
    @InjectModel(MeetingDonations.name)
    private meetingDonations: Model<MeetingDonationsDocument>,
  ) {}

  async create(data, { session }: ITransactionSession) {
    return this.meetingDonations.create([data], { session });
  }

  async findOne({
    query,
    populatePaths,
    session,
  }: GetModelSingleQuery<MeetingDonationsDocument>): Promise<MeetingDonationsDocument> {
    return this.meetingDonations.findOne(
      query,
      {},
      { session: session?.session, populate: populatePaths },
    )
      .exec();
  }

  async findOneAndUpdate({
    query,
    data,
    session = null,
  }: UpdateModelSingleQuery<MeetingDonationsDocument>) {
    return this.meetingDonations.findOneAndUpdate(query, data, {
      new: true,
      session: session?.session,
    });
  }

  async deleteOne(query, { session }: ITransactionSession): Promise<void> {
    await this.meetingDonations.deleteOne(query, { session });

    return;
  }

  async findMany({
    query,
    populatePaths,
    session = null,
  }: GetModelMultipleQuery<MeetingDonationsDocument>) {
    return this.meetingDonations
      .find(query, {}, { session: session?.session, populate: populatePaths })
      .exec();
  }
}
