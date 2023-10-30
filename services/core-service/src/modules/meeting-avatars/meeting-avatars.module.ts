import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingAvatarsController } from './meeting-avatars.controller';
import { MeetingAvatarsService } from './meeting-avatars.service';
import {
  MeetingAvatar,
  MeetingAvatarSchema,
} from '../../schemas/meeting-avatar.schema';
import { ResouceModule } from '../resouces/resouces.module';

@Module({
  imports: [
    ResouceModule,
    MongooseModule.forFeature([
      { name: MeetingAvatar.name, schema: MeetingAvatarSchema },
    ]),
  ],
  controllers: [MeetingAvatarsController],
  providers: [MeetingAvatarsService],
})
export class MeetingAvatarsModule {}
