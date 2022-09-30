import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { UsersModule } from './modules/users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { MeetingNotesModule } from './modules/meeting-notes/meeting-notes.module';
import { ConfigModule } from './services/config/config.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/theliveoffice', {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
    }),
    ScheduleModule.forRoot(),
    MeetingsModule,
    UsersModule,
    TemplatesModule,
    MeetingNotesModule,
    TasksModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
