import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { UsersModule } from './modules/users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { MeetingNotesModule } from './modules/meeting-notes/meeting-notes.module';
import { ConfigModule } from './services/config/config.module';
import { DatabaseModule } from './database/database.module';
import { LurkerModule } from './modules/lurkers/lurkers.module';
import { MeetingChatsModule } from './modules/meeting-chats/meeting-chat.module';

@Module({
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot(),
    MeetingsModule,
    UsersModule,
    LurkerModule,
    TemplatesModule,
    MeetingNotesModule,
    MeetingChatsModule,
    TasksModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
