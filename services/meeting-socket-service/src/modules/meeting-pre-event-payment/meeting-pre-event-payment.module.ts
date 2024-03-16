import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MeetingPreEventPaymentService } from './meeting-pre-event-payment.service';
import {
  MeetingPrePaymentCode,
  MeetingPrePaymentCodeSchema,
} from '../../schemas/meeting-pre-payment-code.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MeetingPrePaymentCode.name,
        schema: MeetingPrePaymentCodeSchema,
      },
    ]),
  ],
  providers: [MeetingPreEventPaymentService],
  exports: [MeetingPreEventPaymentService],
})
export class MeetingPreEventPaymentModule {}
