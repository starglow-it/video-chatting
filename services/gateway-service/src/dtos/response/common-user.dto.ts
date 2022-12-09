import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  ICommonUser,
  IBusinessCategory,
  ILanguage,
  IProfileAvatar,
  ISocialLink,
} from 'shared-types';

export class CommonUserRestDTO implements ICommonUser {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  email: ICommonUser['email'];

  password: string;
  role: ICommonUser['role'];

  @Expose()
  @ApiProperty()
  subscriptionPlanKey: ICommonUser['subscriptionPlanKey'];

  @Expose()
  @ApiProperty()
  nextSubscriptionPlanKey: ICommonUser['subscriptionPlanKey'];

  @Expose()
  @ApiProperty()
  prevSubscriptionPlanKey: ICommonUser['subscriptionPlanKey'];

  @Expose()
  @ApiProperty()
  country: ICommonUser['country'];

  @Expose()
  @ApiProperty()
  registerTemplate: ICommonUser['registerTemplate'];

  @Expose()
  @ApiProperty()
  isConfirmed: ICommonUser['isConfirmed'];

  @Expose()
  @ApiProperty()
  fullName: ICommonUser['fullName'];

  @Expose()
  @ApiProperty()
  position: ICommonUser['position'];

  @Expose()
  @ApiProperty()
  companyName: ICommonUser['companyName'];

  @Expose()
  @ApiProperty()
  contactEmail: ICommonUser['contactEmail'];

  @Expose()
  @ApiProperty()
  description: ICommonUser['description'];

  @Expose()
  @ApiProperty()
  businessCategories: IBusinessCategory[];

  @Expose()
  @ApiProperty()
  languages: ILanguage[];

  @Expose()
  @ApiProperty()
  socials: ISocialLink[];

  @Expose()
  @ApiProperty()
  profileAvatar: IProfileAvatar;

  @Expose()
  @ApiProperty()
  signBoard: ICommonUser['signBoard'];

  @Expose()
  @ApiProperty()
  stripeAccountId: ICommonUser['stripeAccountId'];

  @Expose()
  @ApiProperty()
  stripeEmail: ICommonUser['stripeEmail'];

  @Expose()
  @ApiProperty()
  isStripeEnabled: ICommonUser['isStripeEnabled'];

  @Expose()
  @ApiProperty()
  wasSuccessNotificationShown: ICommonUser['wasSuccessNotificationShown'];

  @Expose()
  @ApiProperty()
  shouldShowTrialExpiredNotification: ICommonUser['shouldShowTrialExpiredNotification'];

  @Expose()
  @ApiProperty()
  isResetPasswordActive: ICommonUser['isResetPasswordActive'];

  @Expose()
  @ApiProperty()
  maxTemplatesNumber: ICommonUser['maxTemplatesNumber'];

  @Expose()
  @ApiProperty()
  renewSubscriptionTimestampInSeconds: ICommonUser['renewSubscriptionTimestampInSeconds'];

  @Expose()
  @ApiProperty()
  maxMeetingTime: ICommonUser['maxMeetingTime'];

  @Expose()
  @ApiProperty()
  isProfessionalTrialAvailable: ICommonUser['isProfessionalTrialAvailable'];

  @Expose()
  @ApiProperty()
  isBlocked: ICommonUser['isBlocked'];

  @Expose()
  @ApiProperty()
  isDowngradeMessageShown: ICommonUser['isBlocked'];

  createdAt: Date;
  updatedAt: Date;
}
