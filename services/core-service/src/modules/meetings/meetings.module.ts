import { forwardRef, Module } from '@nestjs/common';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MeetingInstance,
  MeetingInstanceSchema,
} from '../../schemas/meeting-instance.schema';
import { UsersModule } from '../users/users.module';
import { UserTemplatesModule } from '../user-templates/user-templates.module';
import { CommonTemplatesModule } from '../common-templates/common-templates.module';

@Module({
  imports: [
    UserTemplatesModule,
    CommonTemplatesModule,
    MongooseModule.forFeature([
      {
        name: MeetingInstance.name,
        schema: MeetingInstanceSchema,
      },
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService],
})
export class MeetingsModule {}
