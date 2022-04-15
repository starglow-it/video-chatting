import { Expose, Transform, Type } from 'class-transformer';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';

import { ISocialLink } from '@shared/interfaces/common-social-link.interface';
import { ILanguage } from '@shared/interfaces/common-language.interface';
import { IBusinessCategory } from '@shared/interfaces/business-category.interface';

import { CommonBusinessCategoryDTO } from './common-business-category.dto';
import { CommonLanguageDTO } from './common-language.dto';
import { CommonSocialLinkDTO } from './common-social-link.dto';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import { UserTemplateDTO } from './user-template.dto';
import { ProfileAvatarDTO } from './profile-avatar.dto';
import { IProfileAvatar } from '@shared/interfaces/profile-avatar.interface';

export class CommonUserDTO implements ICommonUserDTO {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  isConfirmed: boolean;

  @Expose()
  fullName: string;

  @Expose()
  position: string;

  @Expose()
  companyName: string;

  @Expose()
  contactEmail: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => CommonBusinessCategoryDTO)
  businessCategories: IBusinessCategory[];

  @Expose()
  @Type(() => CommonLanguageDTO)
  languages: ILanguage[];

  @Expose()
  @Type(() => CommonSocialLinkDTO)
  socials: ISocialLink[];

  @Expose()
  @Type(() => UserTemplateDTO)
  templates: IUserTemplate[];

  @Expose()
  @Type(() => ProfileAvatarDTO)
  profileAvatar: IProfileAvatar;

  @Expose()
  signBoard: ICommonUserDTO['signBoard'];

  tokens: string[];
  password: string;
}
