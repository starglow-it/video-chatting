import { IsNotEmpty, IsString } from 'class-validator';
import { MeetingReactionKind } from 'shared-types';

export class UnReactMeetingQuestionRequestDto {
  @IsNotEmpty()
  @IsString()
  meetingQuestionId: string;

  @IsNotEmpty()
  @IsString()
  kind: MeetingReactionKind;
}
