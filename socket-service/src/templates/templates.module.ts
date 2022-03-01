import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { UsersModule } from '../users/users.module';
import { MeetingsModule } from '../meetings/meetings.module';
import { TemplatesGateway } from './templates.gateway';

@Module({
  imports: [UsersModule, MeetingsModule],
  controllers: [TemplatesController],
  providers: [TemplatesService, TemplatesGateway],
})
export class TemplatesModule {}
