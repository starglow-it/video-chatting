import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IMeetingAvatar, MeetingAvatarStatus } from 'shared-types';
import { CommonResouceResDto } from './common-resouce.dto';

export class CommonMeetingAvatarResDto implements IMeetingAvatar {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({
    type: CommonResouceResDto,
  })
  resouce: IMeetingAvatar['resouce'];

  @Expose()
  @ApiProperty({
    type: String,
    enum: MeetingAvatarStatus,
  })
  status: IMeetingAvatar['status'];

  @Expose()
  @ApiProperty({
    type: String,
    enum: MeetingAvatarStatus,
  })
  roles: IMeetingAvatar['roles'];
}
