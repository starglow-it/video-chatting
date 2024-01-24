import { IsNotEmpty, IsString } from 'class-validator';
import { AnswerSwitchRoleAction } from 'shared-types';

export class AnswerSwitchRoleByAudienceRequestDto {
  @IsNotEmpty()
  @IsString()
  action: AnswerSwitchRoleAction;

  @IsNotEmpty()
  @IsString()
  meetingId: string;
}
