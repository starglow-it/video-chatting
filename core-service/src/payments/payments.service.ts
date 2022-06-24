import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MeetingDonation,
  MeetingDonationDocument,
} from '../schemas/meeting-donation.schema';
import { ITransactionSession } from '../helpers/mongo/withTransaction';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { CustomPopulateOptions } from '../types/custom';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(MeetingDonation.name)
    private meetingDonation: Model<MeetingDonationDocument>,
  ) {}

  async createMeetingDonation({
    data,
    session,
  }: {
    data: { userId: ICommonUserDTO['id']; paymentIntentId: string };
    session: ITransactionSession;
  }) {
    return this.meetingDonation.create(
      [
        {
          user: data.userId,
          paymentIntentId: data.paymentIntentId,
        },
      ],
      { session: session?.session },
    );
  }

  async deleteMeetingDonation({
    query,
    session,
  }: {
    query: FilterQuery<MeetingDonationDocument>;
    session: ITransactionSession;
  }) {
    return this.meetingDonation.deleteMany(query, {
      session: session?.session,
    });
  }

  async findMeetingDonation({
    query,
    session,
    populatePath,
  }: {
    query: FilterQuery<MeetingDonationDocument>;
    session: ITransactionSession;
    populatePath: CustomPopulateOptions;
  }) {
    return this.meetingDonation.findOne(
      query,
      {},
      { session: session?.session, populate: populatePath },
    );
  }
}
