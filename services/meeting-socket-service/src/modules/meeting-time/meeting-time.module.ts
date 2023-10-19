import { Module } from '@nestjs/common';

import { MeetingTimeService } from './meeting-time.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MeetingHostTime,
  MeetingHostTimeSchema,
} from '../../schemas/meeting-time.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MeetingHostTime.name,
        schema: MeetingHostTimeSchema,
      },
    ]),
  ],
  providers: [MeetingTimeService],
  exports: [MeetingTimeService],
})
export class MeetingTimeModule {}
