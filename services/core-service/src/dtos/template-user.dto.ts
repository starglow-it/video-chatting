import { Expose, Transform, Type } from 'class-transformer';

import { ProfileAvatarDTO } from './profile-avatar.dto';

import { IProfileAvatar } from 'shared';
import { ITemplateUser } from 'shared';
import { ICommonUserDTO } from 'shared';

export class TemplateUserDTO implements ITemplateUser {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  @Type(() => ProfileAvatarDTO)
  profileAvatar: IProfileAvatar;

  @Expose()
  maxMeetingTime: ICommonUserDTO['maxMeetingTime'];
}
