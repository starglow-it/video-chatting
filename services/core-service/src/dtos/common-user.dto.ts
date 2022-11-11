import { Expose, Transform, Type } from 'class-transformer';
import {
  IProfileAvatar,
  IUserTemplate,
  IBusinessCategory,
  ILanguage,
  ICommonUser,
  ISocialLink,
} from 'shared-types';

import { CommonBusinessCategoryDTO } from './common-business-category.dto';
import { CommonLanguageDTO } from './common-language.dto';
import { CommonSocialLinkDTO } from './common-social-link.dto';
import { UserTemplateDTO } from './user-template.dto';
import { ProfileAvatarDTO } from './profile-avatar.dto';

export class CommonUserDTO implements ICommonUser {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  stripePlanKey: ICommonUser['stripePlanKey'];

  @Expose()
  email: ICommonUser['email'];

  @Expose()
  country: ICommonUser['country'];

  @Expose()
  registerTemplate: ICommonUser['registerTemplate'];

  @Expose()
  role: ICommonUser['role'];

  @Expose()
  isConfirmed: ICommonUser['isConfirmed'];

  @Expose()
  fullName: ICommonUser['fullName'];

  @Expose()
  position: ICommonUser['position'];

  @Expose()
  companyName: ICommonUser['companyName'];

  @Expose()
  contactEmail: ICommonUser['contactEmail'];

  @Expose()
  description: ICommonUser['description'];

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
  signBoard: ICommonUser['signBoard'];

  @Expose()
  stripeAccountId: ICommonUser['stripeAccountId'];

  @Expose()
  stripeSessionId: ICommonUser['stripeSessionId'];

  @Expose()
  stripeCustomerId: ICommonUser['stripeCustomerId'];

  @Expose()
  stripeSubscriptionId: ICommonUser['stripeSubscriptionId'];

  @Expose()
  isSubscriptionActive: ICommonUser['isSubscriptionActive'];

  @Expose()
  stripeEmail: ICommonUser['stripeEmail'];

  @Expose()
  isStripeEnabled: ICommonUser['isStripeEnabled'];

  @Expose()
  wasSuccessNotificationShown: ICommonUser['wasSuccessNotificationShown'];

  @Expose()
  shouldShowTrialExpiredNotification: ICommonUser['shouldShowTrialExpiredNotification'];

  @Expose()
  subscriptionPlanKey: ICommonUser['subscriptionPlanKey'];

  tokens: string[];
  password: ICommonUser['password'];

  @Expose()
  renewSubscriptionTimestampInSeconds: ICommonUser['renewSubscriptionTimestampInSeconds'];

  @Expose()
  maxTemplatesNumber: ICommonUser['maxTemplatesNumber'];

  @Expose()
  maxMeetingTime: ICommonUser['maxMeetingTime'];

  @Expose()
  isResetPasswordActive: ICommonUser['isResetPasswordActive'];

  @Expose()
  isProfessionalTrialAvailable: ICommonUser['isProfessionalTrialAvailable'];
}
