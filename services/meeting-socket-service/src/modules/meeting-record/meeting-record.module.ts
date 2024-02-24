import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MeetingRecordService } from './meeting-record.service';
import { MeetingRecord, MeetingRecordSchema } from '../../schemas/meeting-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MeetingRecord.name,
        schema: MeetingRecordSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [MeetingRecordService],
  exports: [MeetingRecordService],
})
export class MeetingRecordModule {}
