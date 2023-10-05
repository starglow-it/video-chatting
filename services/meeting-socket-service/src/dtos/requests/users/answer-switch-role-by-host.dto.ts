import { IsNotEmpty, IsString } from 'class-validator';
import { AnswerSwitchRoleAction } from 'shared-types';

export class AnswerSwitchRoleByHostRequestDto {
  @IsNotEmpty()
  @IsString()
  meetingUserId: string;

  @IsNotEmpty()
  @IsString()
  action: AnswerSwitchRoleAction;

  @IsNotEmpty()
  @IsString()
  meetingId: string;
}
