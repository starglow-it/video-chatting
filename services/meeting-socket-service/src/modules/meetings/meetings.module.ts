import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MeetingsService } from './meetings.service';
import { Meeting, MeetingSchema } from '../../schemas/meeting.schema';
import { UsersModule } from '../users/users.module';
import { MeetingTimeModule } from '../meeting-time/meeting-time.module';
import { MeetingsCommonService } from './meetings.common';
import { MeetingChatsModule } from '../meeting-chats/meeting-chats.module';
import { MeetingQuestionAnswersModule } from '../meeting-question-answer/meeting-question-answer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Meeting.name,
        schema: MeetingSchema,
      },
    ]),
    MeetingTimeModule,
    UsersModule,
    MeetingChatsModule,
    MeetingQuestionAnswersModule,
  ],
  controllers: [],
  providers: [MeetingsService, MeetingsCommonService],
  exports: [MeetingsService, MeetingsCommonService],
})
export class MeetingsModule {}
