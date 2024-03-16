import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks.module';
import { ConfigModule } from './services/config/config.module';
import { DatabaseModule } from './database/database.module';
import { CoreModule } from './services/core/core.module';
import { MeetingChatsModule } from './modules/meeting-chats/meeting-chats.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { MeetingRecordModule } from './modules/meeting-record/meeting-record.module';
import { UsersModule } from './modules/users/users.module';
import { MeetingNotesModule } from './modules/meeting-notes/meeting-notes.module';
import { MeetingDonationsModule } from './modules/meeting-donations/meeting-donations.module';
import { MeetingTimeModule } from './modules/meeting-time/meeting-time.module';
import { MeetingQuestionAnswersModule } from './modules/meeting-question-answer/meeting-question-answer.module';
import { MeetingReactionsModule } from './modules/meeting-reactions/meeting-reactions.module';
import { MeetingPreEventPaymentModule } from './modules/meeting-pre-event-payment/meeting-pre-event-payment.module';
import { NotificationsModule } from './services/notifications/notifications.module';
import {
  AudiencesGateway,
  ParticipantsGateway,
  MeetingChatsGateway,
  MeetingNotesGateway,
  MeetingReactionsGateway,
  MeetingsGateway,
  TemplatesGateway,
  UsersGateway,
  MeetingQuestionAnswersGateway
} from './gateways';


@Module({
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot(),
    TasksModule,
    CoreModule,
    ConfigModule,
    MeetingChatsModule,
    MeetingsModule,
    MeetingRecordModule,
    UsersModule,
    MeetingNotesModule,
    MeetingDonationsModule,
    MeetingReactionsModule,
    MeetingTimeModule,
    MeetingQuestionAnswersModule,
    MeetingPreEventPaymentModule,
    NotificationsModule
  ],
  controllers: [],
  providers: [
    MeetingChatsGateway,
    UsersGateway,
    MeetingsGateway,
    MeetingNotesGateway,
    MeetingReactionsGateway,
    AudiencesGateway,
    ParticipantsGateway,
    TemplatesGateway,
    MeetingQuestionAnswersGateway,
  ],
})
export class AppModule { }
