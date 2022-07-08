import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { IBusinessCategory } from '@shared/interfaces/business-category.interface';
import { ILanguage } from '@shared/interfaces/common-language.interface';
import { ISocialLink } from '@shared/interfaces/common-social-link.interface';
import { IProfileAvatar } from '@shared/interfaces/profile-avatar.interface';

export class CommonUserRestDTO implements ICommonUserDTO {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  email: string;

  password: string;

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

  createdAt: Date;
  updatedAt: Date;
}
