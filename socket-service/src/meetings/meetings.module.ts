import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { Meeting, MeetingSchema } from '../schemas/meeting.schema';
import { MeetingsGateway } from './meetings.gateway';
import { UsersModule } from '../users/users.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Meeting.name,
        schema: MeetingSchema,
      },
    ]),
    forwardRef(() => UsersModule),
    TasksModule,
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService, MeetingsGateway],
  exports: [MeetingsService],
})
export class MeetingsModule {}
