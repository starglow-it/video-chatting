import { IsNotEmpty, IsString } from 'class-validator';
import { AnswerSwitchRoleAction } from 'shared-types';

export class AnswerSwitchRoleByLurkerRequestDto {
  @IsNotEmpty()
  @IsString()
  action: AnswerSwitchRoleAction;
}
