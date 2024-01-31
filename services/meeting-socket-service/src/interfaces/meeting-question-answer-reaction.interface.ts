import { MeetingReactionKind } from 'shared-types';
import { IMeetingQuestionAnswer } from './meeting-question-answer.interface';
import { ISenderDto } from './sender.interface';

export interface IMeetingQuestionAnswerReaction {
  id: string;
  meetingQuestionAnswer: IMeetingQuestionAnswer;
  user: ISenderDto;
  kind: MeetingReactionKind;
}
