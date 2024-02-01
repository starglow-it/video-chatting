import { IsNotEmpty, IsString } from 'class-validator';
import { ICommonMeetingUserDTO } from '../../../interfaces/common-user.interface';

export class SwitchRoleByAudienceRequestDto {
  @IsNotEmpty()
  @IsString()
  meetingId: ICommonMeetingUserDTO['meeting'];
}
