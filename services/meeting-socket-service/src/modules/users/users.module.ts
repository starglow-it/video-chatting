import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MeetingUser,
  MeetingUserSchema,
} from '../../schemas/meeting-user.schema';
import { MeetingsModule } from '../meetings/meetings.module';
import { UsersGateway } from '../../gateways/users.gateway';
import { MeetingTimeModule } from '../meeting-time/meeting-time.module';
import { CoreModule } from '../../services/core/core.module';
import { TasksModule } from '../tasks/tasks.module';
import { UsersComponent } from './users.component';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MeetingUser.name,
        schema: MeetingUserSchema,
      },
    ]),
    MeetingTimeModule,
  ],
  providers: [UsersService, UsersComponent],
  exports: [UsersService, UsersComponent],
})
export class UsersModule {}
