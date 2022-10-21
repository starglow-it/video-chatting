import { Expose, Transform, Type } from 'class-transformer';
import { IDashboardNotificationUser } from 'shared';

import { ProfileAvatarDTO } from './profile-avatar.dto';
import { IProfileAvatar } from 'shared';

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
