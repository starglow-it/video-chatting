import { Expose, Transform, Type } from 'class-transformer';
import { IProfileAvatar, IUserTemplate, IBusinessCategory, ILanguage, ICommonUserDTO, ISocialLink } from 'shared';

import { CommonBusinessCategoryDTO } from './common-business-category.dto';
import { CommonLanguageDTO } from './common-language.dto';
import { CommonSocialLinkDTO } from './common-social-link.dto';
import { UserTemplateDTO } from './user-template.dto';
import { ProfileAvatarDTO } from './profile-avatar.dto';

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
  country: ICommonUserDTO['country'];

  @Expose()
  role: ICommonUserDTO['email'];

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
  stripeCustomerId: ICommonUserDTO['stripeCustomerId'];

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

  @Expose()
  isProfessionalTrialAvailable: ICommonUserDTO['isProfessionalTrialAvailable'];
}
