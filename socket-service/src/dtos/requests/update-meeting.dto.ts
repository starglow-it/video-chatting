import { IsNumber, IsOptional } from 'class-validator';
import { IUpdateCommonMeeting } from '../../interfaces/update-meeting.interface';

export class UpdateMeetingRequestDTO implements IUpdateCommonMeeting {
  @IsOptional()
  @IsNumber({}, { message: 'Not valid sharingUserId value' })
  sharingUserId: number;
}
