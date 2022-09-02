import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingUser, MeetingUserSchema } from '../schemas/meeting-user.schema';
import { MeetingsModule } from '../meetings/meetings.module';
import { UsersGateway } from './users.gateway';
import { MeetingTimeModule } from '../modules/meeting-time/meeting-time.module';
import { CoreModule } from '../core/core.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MeetingUser.name,
        schema: MeetingUserSchema,
      },
    ]),
    forwardRef(() => MeetingsModule),
    MeetingTimeModule,
    CoreModule,
    TasksModule,
  ],
  controllers: [],
  providers: [UsersService, UsersGateway],
  exports: [UsersService],
})
export class UsersModule {}
