import { Expose, Transform, Type } from 'class-transformer';
import { IMedia, IMeetingAvatar, MeetingAvatarStatus } from 'shared-types';
import { CommonMediaCategoryDTO } from './common-media-categories.dto';
import { PreviewImageDTO } from './preview-image.dto';
import { UserTemplateDTO } from './user-template.dto';
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
}
