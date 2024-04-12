import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IJoinMeeting } from '../../interfaces/join-meeting.interface';
import { MeetingAvatarRole, MeetingRole } from 'shared-types';

class UserData {
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
  readonly meetingRole: MeetingRole;

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
  @IsBoolean({
    message: 'meeting.invalid',
  })
  readonly isPaywallPaid: boolean;

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

export class JoinMeetingRequestDTO implements IJoinMeeting {
  @Type(() => UserData)
  @IsNotEmpty()
  readonly userData: UserData;

  @IsOptional()
  readonly previousMeetingUserId: string;

  @IsOptional()
  readonly isScheduled: boolean;
}
