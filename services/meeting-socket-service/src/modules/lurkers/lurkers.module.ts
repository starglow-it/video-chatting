import { Module } from '@nestjs/common';
import { LurkersGateway } from './lurkers.gateway';
import { UsersModule } from '../users/users.module';
import { MeetingsModule } from '../meetings/meetings.module';
import { CoreModule } from '../../services/core/core.module';

@Module({
  imports: [
    UsersModule,
    MeetingsModule,
    CoreModule
  ],
  providers: [LurkersGateway],
})
export class LurkerModule {}
