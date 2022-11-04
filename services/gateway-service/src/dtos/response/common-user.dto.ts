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
  email: string;

  password: string;
  role: string;

  @Expose()
  @ApiProperty()
  country: string;

  @Expose()
  @ApiProperty()
  isConfirmed: boolean;

  @Expose()
  @ApiProperty()
  fullName: string;

  @Expose()
  @ApiProperty()
  position: string;

  @Expose()
  @ApiProperty()
  companyName: string;

  @Expose()
  @ApiProperty()
  contactEmail: string;

  @Expose()
  @ApiProperty()
  description: string;

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
  signBoard: string;

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
  isResetPasswordActive: boolean;

  @Expose()
  @ApiProperty()
  maxTemplatesNumber: number;

  @Expose()
  @ApiProperty()
  renewSubscriptionTimestampInSeconds: number;

  @Expose()
  @ApiProperty()
  maxMeetingTime: number;

  @Expose()
  @ApiProperty()
  isProfessionalTrialAvailable: boolean;

  createdAt: Date;
  updatedAt: Date;
}
