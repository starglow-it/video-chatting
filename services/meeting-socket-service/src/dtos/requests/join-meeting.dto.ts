import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IJoinMeeting } from '../../interfaces/join-meeting.interface';
import { MeetingAvatarRole } from 'shared-types';

export class JoinMeetingRequestDTO implements IJoinMeeting {
  @IsOptional()
  @IsString({
    message: 'user.invalid',
  })
  readonly profileId: string;

  @IsOptional()
  @IsString({
    message: 'meeting.invalid',
  })
  readonly profileUserName: string;

  @IsOptional()
  @IsString({
    message: 'meeting.invalid',
  })
  readonly profileAvatar: string;

  @IsNotEmpty()
  @IsString({
    message: 'meeting.invalid',
  })
  readonly templateId: string;

  @IsNotEmpty()
  @IsString({
    message: 'meeting.invalid',
  })
  readonly meetingRole: IJoinMeeting['meetingRole'];

  @IsNotEmpty()
  @IsString({
    message: 'meeting.invalid',
  })
  readonly accessStatus: string;

  @IsNotEmpty()
  @IsNumber()
  readonly maxParticipants: number;

  @IsNotEmpty()
  @IsBoolean({
    message: 'meeting.invalid',
  })
  readonly isAuraActive: boolean;

  @IsNotEmpty()
  @IsString({
    message: 'meeting.invalid',
  })
  readonly micStatus: string;

  @IsNotEmpty()
  @IsString({
    message: 'meeting.invalid',
  })
  readonly cameraStatus: string;

  @IsOptional()
  @IsString({
    message: 'meeting.invalid',
  })
  readonly avatarRole: MeetingAvatarRole;
}
