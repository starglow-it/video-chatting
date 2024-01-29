import { IsNotEmpty, IsString } from 'class-validator';
import { MeetingReactionKind } from 'shared-types';

export class ReactMeetingQuestionRequestDto {
  @IsNotEmpty()
  @IsString({
    message: 'meetingQuestionId invalid',
  })
  meetingQuestionId: string;

  @IsNotEmpty()
  @IsString({
    message: 'Kind invalid',
  })
  kind: MeetingReactionKind;
}
