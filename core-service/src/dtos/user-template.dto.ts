import { Expose, Transform, Type } from 'class-transformer';

// dtos
import { CommonBusinessCategoryDTO } from './common-business-category.dto';
import { CommonLanguageDTO } from './common-language.dto';
import { CommonSocialLinkDTO } from './common-social-link.dto';
import { CommonMeetingDTO } from './common-meeting.dto';
import { TemplateUserDTO } from './template-user.dto';

// interfaces
import { IBusinessCategory } from '@shared/interfaces/business-category.interface';
import { ILanguage } from '@shared/interfaces/common-language.interface';
import { ISocialLink } from '@shared/interfaces/common-social-link.interface';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import { ITemplateUserDTO } from '@shared/interfaces/template-user.interface';
import { ICommonMeetingInstanceDTO } from '@shared/interfaces/common-instance-meeting.interface';

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
  @Type(() => CommonMeetingDTO)
  meetingInstance: ICommonMeetingInstanceDTO;

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

  @Expose()
  @Type(() => TemplateUserDTO)
  user: ITemplateUserDTO;

  @Expose()
  signBoard: string;

  @Expose()
  isMonetizationEnabled: boolean;

  @Expose()
  templatePrice: number;

  @Expose()
  templateCurrency: string;

  @Expose()
  @Transform((data) => data.obj?.usersPosition)
  usersPosition: { top: number; left: number }[];
}
