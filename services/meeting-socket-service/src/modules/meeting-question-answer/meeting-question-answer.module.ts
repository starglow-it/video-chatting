import { Module } from '@nestjs/common';
import { MeetingQuestionAnswersService } from './meeting-question-answer.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MeetingQuestionAnswer,
  MeetingQuestionAnswerSchema,
} from '../../schemas/meeting-question-answer.schema';
import { MeetingQuestionAnswerReactionsService } from './meeting-question-answer-reactions.service';
import {
  MeetingQuestionAnswerReaction,
  MeetingQuestionAnswerReactionSchema,
} from '../../schemas/meeting-question-answer-reaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MeetingQuestionAnswer.name,
        schema: MeetingQuestionAnswerSchema,
      },
      {
        name: MeetingQuestionAnswerReaction.name,
        schema: MeetingQuestionAnswerReactionSchema,
      },
    ]),
  ],
  providers: [MeetingQuestionAnswersService, MeetingQuestionAnswerReactionsService],
  exports: [MeetingQuestionAnswersService, MeetingQuestionAnswerReactionsService],
})
export class MeetingQuestionAnswersModule {}
