import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IUpdateCommonMeeting } from '../../interfaces/update-meeting.interface';

export class UpdateMeetingRequestDTO implements IUpdateCommonMeeting {
  @IsOptional()
  @IsString({ message: 'Not valid sharingUserId value' })
  sharingUserId: string;

  @IsOptional()
  @IsNumber()
  volume: number;
}
