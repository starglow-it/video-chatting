import { Expose, Transform, Type } from 'class-transformer';

import { ProfileAvatarDTO } from './profile-avatar.dto';

import { IProfileAvatar } from '@shared/interfaces/profile-avatar.interface';
import { ITemplateUser } from '@shared/interfaces/template-user.interface';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';

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
