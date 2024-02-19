import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ICommonMeetingUserDTO } from '../../../interfaces/common-user.interface';
import { Type } from 'class-transformer';
import { ICommonMeetingDTO } from '../../../interfaces/common-meeting.interface';
import { MeetingRole } from 'shared-types';
import { UserPositionDto } from './user-position.dto';

export class MeetingUserDto implements ICommonMeetingUserDTO {
  @IsNotEmpty()
  @IsString({
    message: 'Invalid id',
  })
  id: string;

  @IsOptional()
  @IsString({
    message: 'Invalid profileId',
  })
  profileId: string;

  @IsOptional()
  @IsString({
    message: 'Invalid socketId',
  })
  socketId: string;

  @IsOptional()
  @IsString({
    message: 'Invalid username',
  })
  username: string;

  @IsOptional()
  @IsNumber()
  joinedAt: number;

  @IsOptional()
  @IsString({
    message: 'Invalid accessStatus',
  })
  accessStatus: string;

  @IsOptional()
  @IsString({
    message: 'Invalid cameraStatus',
  })
  cameraStatus: string;

  @IsOptional()
  @IsString({
    message: 'Invalid micStatus',
  })
  micStatus: string;

  @IsOptional()
  @IsBoolean({
    message: 'Invalid isGenerated',
  })
  isGenerated: boolean;

  @IsOptional()
  @IsBoolean({
    message: 'Invalid isAuraActive',
  })
  isAuraActive: boolean;

  @IsOptional()
  @IsString({
    message: 'Invalid meeting',
  })
  meeting: ICommonMeetingDTO['id'];

  @IsOptional()
  @IsString({
    message: 'profileAvatar',
  })
  profileAvatar: string;

  @IsOptional()
  @IsString({
    message: 'Invalid meetingAvatarId',
  })
  meetingAvatarId: string;

  @IsOptional()
  @IsString({
    message: 'Invalid meetingRole',
  })
  meetingRole: MeetingRole;

  @IsOptional()
  @Type(() => UserPositionDto)
  userPosition: ICommonMeetingUserDTO['userPosition'];

  @IsOptional()
  @IsNumber()
  userSize: number;

  @IsOptional()
  @IsBoolean({
    message: 'Invalid doNotDisturb',
  })
  doNotDisturb: boolean;
}
