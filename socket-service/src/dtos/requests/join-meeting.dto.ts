import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IJoinMeeting } from '../../interfaces/join-meeting.interface';

export class JoinMeetingRequestDTO implements IJoinMeeting {
  @IsString({
    message: 'user.invalid',
  })
  readonly profileId?: string;

  @IsNotEmpty({
    message: 'Instance id property is empty',
  })
  @IsString({
    message: 'meeting.invalid',
  })
  readonly instanceId: string;

  @IsString({
    message: 'meeting.invalid',
  })
  readonly profileUserName: string;

  @IsBoolean()
  readonly isOwner: boolean;

  @IsBoolean()
  readonly accessStatus: string;

  @IsOptional()
  @IsString()
  readonly profileAvatar: string;
}
