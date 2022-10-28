import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserTokenDocument } from './user-token.schema';
import * as mongoose from 'mongoose';
import { BusinessCategoryDocument } from './business-category.schema';
import { LanguageDocument } from './language.schema';
import { SocialLinkDocument } from './social-link.schema';
import { UserTemplateDocument } from './user-template.schema';
import { ProfileAvatarDocument } from './profile-avatar.schema';
import { ICommonUserDTO } from 'shared';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  id: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  country: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    default: 'user',
  })
  role: 'admin' | 'user';

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  password: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  fullName: string;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  isConfirmed: boolean;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: '',
  })
  companyName: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: '',
  })
  position: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: '',
  })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: '',
  })
  contactEmail: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BusinessCategory' }],
  })
  businessCategories: BusinessCategoryDocument[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
  })
  languages: LanguageDocument[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SocialLink' }],
  })
  socials: SocialLinkDocument[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserTemplate' }],
  })
  templates: UserTemplateDocument[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserToken' }],
  })
  tokens: UserTokenDocument[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProfileAvatar',
  })
  profileAvatar: ProfileAvatarDocument;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: 'default',
  })
  signBoard: ICommonUserDTO['signBoard'];

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  stripeAccountId: ICommonUserDTO['stripeAccountId'];

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  stripeSessionId: ICommonUserDTO['stripeSessionId'];

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  stripeCustomerId: ICommonUserDTO['stripeCustomerId'];

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  stripeSubscriptionId: ICommonUserDTO['stripeSubscriptionId'];

  @Prop({
    type: mongoose.Schema.Types.Boolean,
  })
  isSubscriptionActive: ICommonUserDTO['isSubscriptionActive'];

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  stripeEmail: ICommonUserDTO['stripeEmail'];

  @Prop({
    type: mongoose.Schema.Types.String,
    default: 'House',
  })
  subscriptionPlanKey: ICommonUserDTO['subscriptionPlanKey'];

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  isStripeEnabled: ICommonUserDTO['isStripeEnabled'];

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  wasSuccessNotificationShown: ICommonUserDTO['wasSuccessNotificationShown'];

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  isResetPasswordActive: ICommonUserDTO['isResetPasswordActive'];

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 1,
  })
  maxTemplatesNumber: ICommonUserDTO['maxTemplatesNumber'];

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 120 * 60 * 1000,
  })
  maxMeetingTime: ICommonUserDTO['maxMeetingTime'];

  @Prop({
    type: mongoose.Schema.Types.Number,
  })
  renewSubscriptionTimestampInSeconds: ICommonUserDTO['renewSubscriptionTimestampInSeconds'];

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: true,
  })
  isProfessionalTrialAvailable: ICommonUserDTO['isProfessionalTrialAvailable'];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
