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
import { PreviewImageDTO } from './preview-image.dto';

export class UserTemplateDTO implements IUserTemplate {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  description: IUserTemplate['description'];

  @Expose()
  shortDescription: IUserTemplate['shortDescription'];

  @Expose()
  usedAt: IUserTemplate['usedAt'];

  @Expose()
  @Type(() => CommonBusinessCategoryDTO)
  businessCategories: IBusinessCategory[];

  @Expose()
  @Type(() => CommonMeetingDTO)
  meetingInstance: ICommonMeetingInstanceDTO;

  @Expose()
  templateId: IUserTemplate['templateId'];

  @Expose()
  url: IUserTemplate['url'];

  @Expose()
  name: IUserTemplate['name'];

  @Expose()
  maxParticipants: IUserTemplate['maxParticipants'];

  @Expose()
  @Type(() => PreviewImageDTO)
  previewUrls: IUserTemplate['previewUrls'];

  @Expose()
  type: IUserTemplate['type'];

  @Expose()
  fullName: IUserTemplate['fullName'];

  @Expose()
  companyName: IUserTemplate['companyName'];

  @Expose()
  position: IUserTemplate['position'];

  @Expose()
  contactEmail: IUserTemplate['contactEmail'];

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
  customLink: IUserTemplate['customLink'];

  @Expose()
  isMonetizationEnabled: IUserTemplate['isMonetizationEnabled'];

  @Expose()
  templatePrice: IUserTemplate['templatePrice'];

  @Expose()
  templateCurrency: IUserTemplate['templateCurrency'];

  @Expose()
  isAudioAvailable: IUserTemplate['isAudioAvailable'];

  @Expose()
  priceInCents: IUserTemplate['priceInCents'];

  @Expose()
  @Transform((data) => data.obj?.usersPosition)
  usersPosition: IUserTemplate['usersPosition'];

  @Expose()
  @Transform((data) =>
    data.obj?.links?.map((link) => ({
      id: link._id,
      item: link.item,
      position: link.position,
    })),
  )
  links: IUserTemplate['links'];
}
