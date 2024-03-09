import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IAudienceJoinMeeting } from '../../interfaces/audience-join-meeting.interface';
export class AudienceJoinMeetingDto implements IAudienceJoinMeeting {
  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  meetingAvatarId: string;

  @IsOptional()
  userLocation: {
    country: string;
    state: string;
  };
}
