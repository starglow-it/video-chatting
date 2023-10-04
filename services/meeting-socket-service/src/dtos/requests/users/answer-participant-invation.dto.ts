import { IsNotEmpty, IsString } from 'class-validator';
import { AnswerInvitationAction } from 'shared-types';

export class AnswerParticipantInvitationRequestDto {
  @IsNotEmpty()
  @IsString()
  action: AnswerInvitationAction;
}
