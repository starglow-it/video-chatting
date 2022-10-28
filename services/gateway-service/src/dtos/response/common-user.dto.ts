import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ICommonUserDTO } from 'shared';
import { IBusinessCategory } from 'shared';
import { ILanguage } from 'shared';
import { ISocialLink } from 'shared';
import { IProfileAvatar } from 'shared';

export class CommonUserRestDTO implements ICommonUserDTO {
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
  stripeAccountId: ICommonUserDTO['stripeAccountId'];

  @Expose()
  @ApiProperty()
  stripeEmail: ICommonUserDTO['stripeEmail'];

  @Expose()
  @ApiProperty()
  isStripeEnabled: ICommonUserDTO['isStripeEnabled'];

  @Expose()
  @ApiProperty()
  wasSuccessNotificationShown: ICommonUserDTO['wasSuccessNotificationShown'];

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
