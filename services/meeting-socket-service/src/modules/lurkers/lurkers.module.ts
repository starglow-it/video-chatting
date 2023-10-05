import { Module } from '@nestjs/common';
import { LurkersGateway } from './lurkers.gateway';
import { MeetingsService } from '../meetings/meetings.service';

@Module({
  imports: [
    UsersModule,
    MeetingsService
  ],
  providers: [LurkersGateway],
})
export class UsersModule {}
