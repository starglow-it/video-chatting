import { Expose, Transform, Type } from 'class-transformer';
import { serializeInstance } from '../serialization';
import { IMeetingQuestionAnswer } from '../../interfaces/meeting-question-answer.interface';
import { ISenderDto } from '../../interfaces/sender.interface';
import { IMeetingQuestionAnswerReaction } from '../../interfaces/meeting-question-answer-reaction.interface';
import { MeetingReactionKind } from 'shared-types';
import { MeetingQuestionAnswerDto } from './meeting-question-answer.dto';
import { MeetingQuestionAnswerReactionDocument } from '../../schemas/meeting-question-answer-reaction.schema';
import { SenderDto } from './sender.dto';

export class MeetingQuestionAnswerReactionDto implements IMeetingQuestionAnswerReaction {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  @Type(() => MeetingQuestionAnswerDto)
  meetingQuestionAnswer: IMeetingQuestionAnswer;

  @Expose()
  @Type(() => SenderDto)
  user: ISenderDto;

  @Expose()
  kind: MeetingReactionKind;
}

export const meetingQuestionAnswerReactionSerialization = <
  D extends MeetingQuestionAnswerReactionDocument | MeetingQuestionAnswerReactionDocument[],
>(
  meetingQuestionAnswerReaction: D,
) => serializeInstance(meetingQuestionAnswerReaction, MeetingQuestionAnswerReactionDto);
