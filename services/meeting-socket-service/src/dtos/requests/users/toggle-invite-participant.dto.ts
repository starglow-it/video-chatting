import { IsNotEmpty, IsString } from 'class-validator';
import { ICommonMeetingUserDTO } from '../../../interfaces/common-user.interface';
import { ParticipantInvivationAction } from 'shared-types';

export class ToggleInviteParticipantRequestDto {
  @IsNotEmpty()
  @IsString()
  meetingId: ICommonMeetingUserDTO['meeting'];

  @IsNotEmpty()
  @IsString()
  meetingUserId: ICommonMeetingUserDTO['id'];

  @IsNotEmpty()
  @IsString()
  action: ParticipantInvivationAction;
}
