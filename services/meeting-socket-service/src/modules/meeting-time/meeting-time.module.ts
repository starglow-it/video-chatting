import { Module } from '@nestjs/common';

import { MeetingTimeService } from './meeting-time.service';
import { MeetingTimeController } from './meeting-time.controller';
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
  controllers: [MeetingTimeController],
  exports: [MeetingTimeService],
})
export class MeetingTimeModule {}
