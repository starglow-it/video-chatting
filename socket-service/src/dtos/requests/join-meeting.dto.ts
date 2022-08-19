import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { IJoinMeeting } from '../../interfaces/join-meeting.interface';

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

  @IsBoolean()
  readonly isOwner: boolean;

  @IsBoolean()
  readonly accessStatus: string;

  @IsOptional()
  @IsString()
  readonly profileAvatar: string;

  @IsNumber()
  readonly maxParticipants: number;

  @IsBoolean()
  readonly isAuraActive: boolean;
}
