import { Expose, Transform, Type } from 'class-transformer';

import { ProfileAvatarDTO } from './profile-avatar.dto';

import { ICommonUser, ITemplateUser, IProfileAvatar } from 'shared-types';

export class TemplateUserDTO implements ITemplateUser {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  @Type(() => ProfileAvatarDTO)
  profileAvatar: IProfileAvatar;

  @Expose()
  maxMeetingTime: ICommonUser['maxMeetingTime'];
}
