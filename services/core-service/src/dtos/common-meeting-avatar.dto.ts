import { Expose, Transform, Type } from 'class-transformer';
import { IMeetingAvatar } from 'shared-types';
import { CommonResouceDto } from './common-resouce.dto';

export class CommonMeetingAvatarDto implements IMeetingAvatar {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  @Type(() => CommonResouceDto)
  resouce: IMeetingAvatar['resouce'];

  @Expose()
  status: IMeetingAvatar['status'];

  @Expose()
  roles: IMeetingAvatar['roles'];
}
