import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ILurkerJoinMeeting } from '../../interfaces/lurker-join-meeting.interface';
import { Type } from 'class-transformer';

class UserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class LurkerJoinMeetingDto implements ILurkerJoinMeeting {
  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  meetingAvatarId: string;
}
