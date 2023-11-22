import { ICommonMeetingUserDTO } from '../../../interfaces/common-user.interface';
import { ICommonMeetingDTO } from '../../../interfaces/common-meeting.interface';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MeetingUserDto } from './meeting-user.dto';

export class MeetingDto implements ICommonMeetingDTO {
  @IsNotEmpty()
  @IsString({
    message: 'Invalid id',
  })
  id: string;

  @IsOptional()
  @IsString({
    message: 'Invalid sharingUserId',
  })
  sharingUserId: string;

  @IsOptional()
  @IsString({
    message: 'Invalid mode',
  })
  mode: string;

  @IsOptional()
  @IsString({
    message: 'Invalid hostUserId',
  })
  hostUserId: string;

  @IsOptional()
  @IsString({
    message: 'Invalid ownerProfileId',
  })
  ownerProfileId: string;

  @IsOptional()
  @IsNumber()
  endsAt: number;

  @IsOptional()
  @IsString({
    message: 'Invalid ownerProfileId',
  })
  startAt: number;

  @IsOptional()
  @IsNumber()
  volume: number;

  @IsOptional()
  @IsBoolean({
    message: 'Invalid isMute',
  })
  isMute: boolean;

  @IsOptional()
  @IsString({
    message: 'Invalid owner',
  })
  owner: string;

  @IsOptional()
  @IsBoolean({
    message: 'Invalid',
  })
  isBlockAudiences: boolean;

  @IsOptional()
  @Type(() => MeetingUserDto)
  users: ICommonMeetingUserDTO[];

}
