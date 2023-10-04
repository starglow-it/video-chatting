import { IsNotEmpty, IsString } from 'class-validator';
import { ICommonMeetingUserDTO } from '../../../interfaces/common-user.interface';

export class CancelParticipantInvationRequestDto {
  @IsNotEmpty()
  @IsString()
  meetingId: ICommonMeetingUserDTO['meeting'];
  
  @IsNotEmpty()
  @IsString()
  meetingUserId: ICommonMeetingUserDTO['id'];
}
