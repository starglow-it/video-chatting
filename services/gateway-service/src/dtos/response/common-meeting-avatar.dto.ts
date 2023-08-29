import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IPreviewImage,
  IMedia,
  IMeetingAvatar,
  IResouce,
  MeetingAvatarStatus,
} from 'shared-types';
import { CommonResouceResDto } from './common-resouce.dto';

export class CommonMeetingAvatarResDto implements IMeetingAvatar {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({
    type: CommonResouceResDto,
  })
  resouce: IResouce;

  @Expose()
  @ApiProperty({
    type: String,
    enum: MeetingAvatarStatus,
  })
  status: MeetingAvatarStatus;
}
