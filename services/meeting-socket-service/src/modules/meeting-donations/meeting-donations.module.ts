import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MeetingDonationsService } from './meeting-donations.service';
import {
  MeetingDonations,
  MeetingDonationsSchema,
} from '../../schemas/meeting-donations.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MeetingDonations.name,
        schema: MeetingDonationsSchema,
      },
    ]),
  ],
  providers: [MeetingDonationsService],
  exports: [MeetingDonationsService],
})
export class MeetingDonationsModule {}
