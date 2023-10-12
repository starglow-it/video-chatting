import { IsNotEmpty, IsString } from 'class-validator';
import { MeetingReactionKind } from 'shared-types';

export class UnReactMeetingChatRequestDto {
  @IsNotEmpty()
  @IsString()
  meetingChatId: string;

  @IsNotEmpty()
  @IsString()
  kind: MeetingReactionKind;
}
