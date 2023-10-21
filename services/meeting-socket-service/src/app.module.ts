import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks.module';
import { ConfigModule } from './services/config/config.module';
import { DatabaseModule } from './database/database.module';
import { CoreModule } from './services/core/core.module';
import { MeetingChatsModule } from './modules/meeting-chats/meeting-chats.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { UsersModule } from './modules/users/users.module';
import { MeetingNotesModule } from './modules/meeting-notes/meeting-notes.module';
import { MeetingTimeModule } from './modules/meeting-time/meeting-time.module';
import {
  LurkersGateway,
  MeetingChatsGateway,
  MeetingNotesGateway,
  MeetingsGateway,
  TemplatesGateway,
  UsersGateway,
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
    UsersModule,
    MeetingNotesModule,
    MeetingTimeModule,
  ],
  controllers: [],
  providers: [
    MeetingChatsGateway,
    UsersGateway,
    MeetingsGateway,
    MeetingNotesGateway,
    LurkersGateway,
    TemplatesGateway,
  ],
})
export class AppModule {}
