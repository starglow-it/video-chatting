import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MeetingReactionsService } from './meeting-reactions.service';
import {
  MeetingReaction,
  MeetingReactionSchema,
} from '../../schemas/meeting-reaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MeetingReaction.name,
        schema: MeetingReactionSchema,
      },
    ]),
  ],
  providers: [MeetingReactionsService],
  exports: [MeetingReactionsService],
})
export class MeetingReactionsModule {}
