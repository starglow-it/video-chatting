import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { IJoinMeeting } from '../../interfaces/join-meeting.interface';
import { MeetingAvatarRole } from 'shared-types';

export class JoinMeetingRequestDTO implements IJoinMeeting {
  @IsString({
    message: 'user.invalid',
  })
  readonly profileId?: string;

  @IsString({
    message: 'meeting.invalid',
  })
  readonly profileUserName: string;

  @IsString({
    message: 'meeting.invalid',
  })
  readonly templateId: string;

  @IsString()
  readonly meetingRole: IJoinMeeting['meetingRole'];

  @IsBoolean()
  readonly accessStatus: string;

  @IsOptional()
  @IsString()
  readonly profileAvatar: string;

  @IsNumber()
  readonly maxParticipants: number;

  @IsBoolean()
  readonly isAuraActive: boolean;

  @IsBoolean()
  readonly micStatus: string;

  @IsBoolean()
  readonly cameraStatus: string;

  @IsString()
  readonly avatarRole: MeetingAvatarRole;
}
