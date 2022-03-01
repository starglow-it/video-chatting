import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingUser, MeetingUserSchema } from '../schemas/meeting-user.schema';
import { MeetingsModule } from '../meetings/meetings.module';
import { UsersGateway } from './users.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MeetingUser.name,
        schema: MeetingUserSchema,
      },
    ]),
    forwardRef(() => MeetingsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersGateway],
  exports: [UsersService],
})
export class UsersModule {}
