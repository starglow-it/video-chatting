import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MeetingsService } from './meetings.service';
import { Meeting, MeetingSchema } from '../../schemas/meeting.schema';
import { MeetingsGateway } from './meetings.gateway';
import { UsersModule } from '../users/users.module';
import { TasksModule } from '../tasks/tasks.module';
import { CoreModule } from '../../services/core/core.module';
import { MeetingTimeModule } from '../meeting-time/meeting-time.module';
import { MeetingsCommonService } from './meetings.common';

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
    CoreModule,
    MeetingTimeModule,
  ],
  controllers: [],
  providers: [MeetingsService, MeetingsGateway, MeetingsCommonService],
  exports: [MeetingsService, MeetingsCommonService],
})
export class MeetingsModule {}
