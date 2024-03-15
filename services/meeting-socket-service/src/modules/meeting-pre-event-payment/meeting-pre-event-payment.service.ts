import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  MeetingPrePaymentCode,
  MeetingPrePaymentCodeDocument,
} from '../../schemas/meeting-pre-payment-code.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { GetModelMultipleQuery, UpdateModelSingleQuery, GetModelSingleQuery } from 'src/types/mongoose';

@Injectable()
export class MeetingPreEventPaymentService {
  constructor(
    @InjectModel(MeetingPrePaymentCode.name)
    private meetingPreEventPayment: Model<MeetingPrePaymentCodeDocument>,
  ) {}

  async create(data, { session }: ITransactionSession) {
    return this.meetingPreEventPayment.create([data], { session });
  }

  async findOne({
    query,
    populatePaths,
    session,
  }: GetModelSingleQuery<MeetingPrePaymentCodeDocument>): Promise<MeetingPrePaymentCodeDocument> {
    return this.meetingPreEventPayment.findOne(
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
  }: UpdateModelSingleQuery<MeetingPrePaymentCodeDocument>) {
    return this.meetingPreEventPayment.findOneAndUpdate(query, data, {
      new: true,
      session: session?.session,
    });
  }

  async deleteOne(query, { session }: ITransactionSession): Promise<void> {
    await this.meetingPreEventPayment.deleteOne(query, { session });

    return;
  }

  async findMany({
    query,
    populatePaths,
    session = null,
  }: GetModelMultipleQuery<MeetingPrePaymentCodeDocument>) {
    return this.meetingPreEventPayment
      .find(query, {}, { session: session?.session, populate: populatePaths })
      .exec();
  }
}
