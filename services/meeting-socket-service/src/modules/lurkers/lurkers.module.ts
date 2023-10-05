import { Module } from '@nestjs/common';
import { LurkersGateway } from './lurkers.gateway';
import { UsersModule } from '../users/users.module';
import { MeetingsModule } from '../meetings/meetings.module';

@Module({
  imports: [
    UsersModule,
    MeetingsModule
  ],
  providers: [LurkersGateway],
})
export class LurkerModule {}
