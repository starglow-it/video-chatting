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
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  email: ICommonUserDTO['email'];

  @Expose()
  isConfirmed: ICommonUserDTO['isConfirmed'];

  @Expose()
  fullName: ICommonUserDTO['fullName'];

  @Expose()
  position: ICommonUserDTO['position'];

  @Expose()
  companyName: ICommonUserDTO['companyName'];

  @Expose()
  contactEmail: ICommonUserDTO['contactEmail'];

  @Expose()
  description: ICommonUserDTO['description'];

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

  @Expose()
  stripeAccountId: ICommonUserDTO['stripeAccountId'];

  @Expose()
  stripeSessionId: ICommonUserDTO['stripeSessionId'];

  @Expose()
  stripeSubscriptionId: ICommonUserDTO['stripeSubscriptionId'];

  @Expose()
  isSubscriptionActive: ICommonUserDTO['isSubscriptionActive'];

  @Expose()
  stripeEmail: ICommonUserDTO['stripeEmail'];

  @Expose()
  isStripeEnabled: ICommonUserDTO['isStripeEnabled'];

  @Expose()
  wasSuccessNotificationShown: ICommonUserDTO['wasSuccessNotificationShown'];

  @Expose()
  subscriptionPlanKey: ICommonUserDTO['subscriptionPlanKey'];

  tokens: string[];
  password: ICommonUserDTO['password'];

  @Expose()
  renewSubscriptionTimestampInSeconds: ICommonUserDTO['renewSubscriptionTimestampInSeconds'];

  @Expose()
  maxTemplatesNumber: ICommonUserDTO['maxTemplatesNumber'];

  @Expose()
  maxMeetingTime: ICommonUserDTO['maxMeetingTime'];

  @Expose()
  isResetPasswordActive: ICommonUserDTO['isResetPasswordActive'];
}
