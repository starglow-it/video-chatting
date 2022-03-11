import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingsModule } from './meetings/meetings.module';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { TemplatesModule } from './templates/templates.module';
import { MeetingNotesModule } from './meeting-notes/meeting-notes.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/theliveoffice'),
    ScheduleModule.forRoot(),
    MeetingsModule,
    UsersModule,
    TasksModule,
    TemplatesModule,
    MeetingNotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
