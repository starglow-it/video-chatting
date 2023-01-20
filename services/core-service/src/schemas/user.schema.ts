import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserTokenDocument } from './user-token.schema';
import * as mongoose from 'mongoose';
import { BusinessCategoryDocument } from './business-category.schema';
import { LanguageDocument } from './language.schema';
import { SocialLinkDocument } from './social-link.schema';
import { UserTemplateDocument } from './user-template.schema';
import { ProfileAvatarDocument } from './profile-avatar.schema';
import {ICommonUser, PlanKeys, UserRoles} from 'shared-types';

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
    default: UserRoles.User,
  })
  role: UserRoles;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  password: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  registerTemplate: string;

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
  signBoard: ICommonUser['signBoard'];

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  stripeAccountId: ICommonUser['stripeAccountId'];

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  stripeSessionId: ICommonUser['stripeSessionId'];

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  stripeCustomerId: ICommonUser['stripeCustomerId'];

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  stripeSubscriptionId: ICommonUser['stripeSubscriptionId'];

  @Prop({
    type: mongoose.Schema.Types.Boolean,
  })
  isSubscriptionActive: ICommonUser['isSubscriptionActive'];

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  stripeEmail: ICommonUser['stripeEmail'];

  @Prop({
    type: mongoose.Schema.Types.String,
    default: PlanKeys.House,
  })
  subscriptionPlanKey: ICommonUser['subscriptionPlanKey'];

  @Prop({
    type: mongoose.Schema.Types.String,
    default: PlanKeys.House,
  })
  nextSubscriptionPlanKey: ICommonUser['nextSubscriptionPlanKey'];

  @Prop({
    type: mongoose.Schema.Types.String,
    default: PlanKeys.House,
  })
  prevSubscriptionPlanKey: ICommonUser['prevSubscriptionPlanKey'];

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  isStripeEnabled: ICommonUser['isStripeEnabled'];

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  wasSuccessNotificationShown: ICommonUser['wasSuccessNotificationShown'];

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  shouldShowTrialExpiredNotification: ICommonUser['shouldShowTrialExpiredNotification'];

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  isResetPasswordActive: ICommonUser['isResetPasswordActive'];

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 1,
  })
  maxTemplatesNumber: ICommonUser['maxTemplatesNumber'];

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 120 * 60 * 1000,
  })
  maxMeetingTime: ICommonUser['maxMeetingTime'];

  @Prop({
    type: mongoose.Schema.Types.Number,
  })
  renewSubscriptionTimestampInSeconds: ICommonUser['renewSubscriptionTimestampInSeconds'];

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: true,
  })
  isProfessionalTrialAvailable: ICommonUser['isProfessionalTrialAvailable'];

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  isBlocked: ICommonUser['isBlocked'];

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: true,
  })
  isDowngradeMessageShown: ICommonUser['isDowngradeMessageShown'];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
