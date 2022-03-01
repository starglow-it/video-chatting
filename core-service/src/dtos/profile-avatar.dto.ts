import { Expose, Transform } from 'class-transformer';

import { IProfileAvatar } from '@shared/interfaces/profile-avatar.interface';

export class ProfileAvatarDTO implements IProfileAvatar {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  url: string;

  @Expose()
  mimeType: string;

  @Expose()
  size: number;
}
