import { Expose, Transform, Type } from 'class-transformer';

import { IBusinessCategory } from '@shared/interfaces/business-category.interface';

import { CommonBusinessCategoryDTO } from './common-business-category.dto';
import { CommonLanguageDTO } from './common-language.dto';
import { CommonSocialLinkDTO } from './common-social-link.dto';

import { ILanguage } from '@shared/interfaces/common-language.interface';
import { ISocialLink } from '@shared/interfaces/common-social-link.interface';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';

export class UserTemplateDTO implements IUserTemplate {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  description: string;

  @Expose()
  usedAt: string;

  @Expose()
  @Type(() => CommonBusinessCategoryDTO)
  businessCategories: IBusinessCategory[];

  @Expose()
  templateId: number;

  @Expose()
  url: string;

  @Expose()
  name: string;

  @Expose()
  maxParticipants: number;

  @Expose()
  previewUrl: string;

  @Expose()
  type: string;

  @Expose()
  fullName: string;

  @Expose()
  companyName: string;

  @Expose()
  position: string;

  @Expose()
  contactEmail: string;

  @Expose()
  @Type(() => CommonLanguageDTO)
  languages: ILanguage[];

  @Expose()
  @Type(() => CommonSocialLinkDTO)
  socials: ISocialLink[];
}
