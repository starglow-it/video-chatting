import { Expose, Transform, Type } from 'class-transformer';

import {IProfileAvatar, IFeaturedBackgroundUser, UserRoles } from 'shared-types';
import { ProfileAvatarDTO } from './profile-avatar.dto';

export class FeaturedBackgroundUserDto implements IFeaturedBackgroundUser {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  @Type(() => ProfileAvatarDTO)
  profileAvatar: IProfileAvatar;

  @Expose()
  role: UserRoles;
}
