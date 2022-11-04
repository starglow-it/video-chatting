import { Expose, Transform, Type } from 'class-transformer';
import { IProfileAvatar, IDashboardNotificationUser } from 'shared-types';

import { ProfileAvatarDTO } from './profile-avatar.dto';

export class DashboardNotificationUserDTO
  implements IDashboardNotificationUser
{
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  @Type(() => ProfileAvatarDTO)
  profileAvatar: IProfileAvatar;
}
