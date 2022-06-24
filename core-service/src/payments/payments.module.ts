import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MeetingDonation,
  MeetingDonationSchema,
} from '../schemas/meeting-donation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MeetingDonation.name, schema: MeetingDonationSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
