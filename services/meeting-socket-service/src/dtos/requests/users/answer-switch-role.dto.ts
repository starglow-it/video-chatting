import { IsNotEmpty, IsString } from 'class-validator';
import { AnswerSwitchRoleAction } from 'shared-types';

export class AnswerSwitchRoleRequestDto {
  @IsNotEmpty()
  @IsString()
  action: AnswerSwitchRoleAction;
}
