import { IsNotEmpty, IsString } from 'class-validator';
import { ICommonMeetingUserDTO } from '../../../interfaces/common-user.interface';
import { RequestSwitchRoleAction } from 'shared-types';

export class SwtichRoleRequestDto {
  @IsNotEmpty()
  @IsString()
  meetingId: ICommonMeetingUserDTO['meeting'];

  @IsNotEmpty()
  @IsString()
  meetingUserId: ICommonMeetingUserDTO['id'];

  @IsNotEmpty()
  @IsString()
  action: RequestSwitchRoleAction;
} 