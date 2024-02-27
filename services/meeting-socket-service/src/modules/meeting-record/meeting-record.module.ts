import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MeetingRecordCommonService } from './meeting-record.common';
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
  providers: [MeetingRecordService, MeetingRecordCommonService],
  exports: [MeetingRecordService, MeetingRecordCommonService],
})
export class MeetingRecordModule {}
