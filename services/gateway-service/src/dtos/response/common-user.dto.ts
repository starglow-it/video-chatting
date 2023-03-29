import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  ICommonUser,
  IBusinessCategory,
  ILanguage,
  IProfileAvatar,
  ISocialLink,
  UserRoles,
  PlanKeys,
  LoginTypes,
} from 'shared-types';


class BusinessCategory {
  
  @Expose()
  @ApiProperty({
    type: String
  })
  key: string;

  @Expose()
  @ApiProperty({
    type: String
  })
  value: string;

  @Expose()
  @ApiProperty({
    type: String
  })
  color: string;
}

class Language {
  @Expose()
  @ApiProperty({
    type: String
  })
  key: string;

  @Expose()
  @ApiProperty({
    type: String
  })
  value: string;
}

class  ProfileAvatar {
  @Expose()
  @ApiProperty({
    type: String
  })
  id: string;

  @Expose()
  @ApiProperty({
    type: String
  })
  url: string;

  @Expose()
  @ApiProperty({
    type: Number
  })
  size: number;

  @Expose()
  @ApiProperty({
    type: String
  })
  mimeType: string;
}

class SocialLink extends Language {}

export class CommonUserRestDTO implements ICommonUser {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({
    type: String
  })
  email: ICommonUser['email'];


  @Expose()
  @ApiProperty({
    type: String
  })
  password: string;


  @Expose()
  @ApiProperty({
    type: String,
    enum: UserRoles
  })
  role: ICommonUser['role'];

  @Expose()
  @ApiProperty({
    type: String,
    enum: PlanKeys
  })
  subscriptionPlanKey: ICommonUser['subscriptionPlanKey'];

  @Expose()
  @ApiProperty({
    type: String,
    enum: PlanKeys
  })
  nextSubscriptionPlanKey: ICommonUser['nextSubscriptionPlanKey'];

  @Expose()
  @ApiProperty({
    type: String,
    enum: PlanKeys
  })
  prevSubscriptionPlanKey: ICommonUser['prevSubscriptionPlanKey'];

  @Expose()
  @ApiProperty({
    type: String
  })
  country: ICommonUser['country'];

  @Expose()
  @ApiProperty({
    type: String
  })
  registerTemplate: ICommonUser['registerTemplate'];

  @Expose()
  @ApiProperty()
  isConfirmed: ICommonUser['isConfirmed'];

  @Expose()
  @ApiProperty({
    type: String
  })
  fullName: ICommonUser['fullName'];

  @Expose()
  @ApiProperty({
    type: String
  })
  position: ICommonUser['position'];

  @Expose()
  @ApiProperty({
    type: String
  })
  companyName: ICommonUser['companyName'];

  @Expose()
  @ApiProperty({
    type: String
  })
  contactEmail: ICommonUser['contactEmail'];

  @Expose()
  @ApiProperty({
    type: String
  })
  description: ICommonUser['description'];

  @Expose()
  @ApiProperty({
    type: [BusinessCategory]
  })
  businessCategories: IBusinessCategory[];

  @Expose()
  @ApiProperty({
    type: [Language]
  })
  languages: ILanguage[];

  @Expose()
  @ApiProperty({
    type: [SocialLink]
  })
  socials: ISocialLink[];

  @Expose()
  @ApiProperty({
    type: ProfileAvatar
  })
  profileAvatar: IProfileAvatar;

  @Expose()
  @ApiProperty({
    type: String
  })
  signBoard: ICommonUser['signBoard'];

  @Expose()
  @ApiProperty({
    type: String
  })
  stripeAccountId: ICommonUser['stripeAccountId'];

  @Expose()
  @ApiProperty({
    type: String
  })
  stripeEmail: ICommonUser['stripeEmail'];

  @Expose()
  @ApiProperty({
    type: Boolean
  })
  isStripeEnabled: ICommonUser['isStripeEnabled'];

  @Expose()
  @ApiProperty({
    type: Boolean
  })
  wasSuccessNotificationShown: ICommonUser['wasSuccessNotificationShown'];

  @Expose()
  @ApiProperty({
    type: Boolean
  })
  shouldShowTrialExpiredNotification: ICommonUser['shouldShowTrialExpiredNotification'];

  @Expose()
  @ApiProperty({
    type: Boolean
  })
  isResetPasswordActive: ICommonUser['isResetPasswordActive'];

  @Expose()
  @ApiProperty({
    type: Number
  })
  maxTemplatesNumber: ICommonUser['maxTemplatesNumber'];

  @Expose()
  @ApiProperty({
    type: Number
  })
  renewSubscriptionTimestampInSeconds: ICommonUser['renewSubscriptionTimestampInSeconds'];

  @Expose()
  @ApiProperty({
    type: Number
  })
  maxMeetingTime: ICommonUser['maxMeetingTime'];

  @Expose()
  @ApiProperty({
    type: Boolean
  })
  isProfessionalTrialAvailable: ICommonUser['isProfessionalTrialAvailable'];

  @Expose()
  @ApiProperty({
    type: Boolean
  })
  isBlocked: ICommonUser['isBlocked'];

  @Expose()
  @ApiProperty({
    type: Boolean
  })
  isDowngradeMessageShown: ICommonUser['isBlocked'];

  @Expose()
  loginType: ICommonUser['loginType'];

  createdAt: Date;
  updatedAt: Date;
}
