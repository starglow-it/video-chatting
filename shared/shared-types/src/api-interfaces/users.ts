import {
  IBusinessCategory,
  ILanguage,
  ISocialLink,
  IProfileAvatar,
  PlanKeys,
} from './common';

export enum UserRoles {
  Admin = 'admin',
  User = 'user',
}

export interface ICommonUser {
  id: string;
  email: string;
  country: string;
  registerTemplate: string;
  role: UserRoles;
  password: string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
  position: string;
  companyName: string;
  contactEmail: string;
  description: string;
  businessCategories: IBusinessCategory[];
  languages: ILanguage[];
  socials: ISocialLink[];
  profileAvatar: IProfileAvatar;
  signBoard: string;
  stripeAccountId: string;
  stripeSessionId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionPlanKey?: PlanKeys;
  previousSubscriptionPlanKey?: PlanKeys;
  stripeEmail: string;
  maxTemplatesNumber: number;
  maxMeetingTime: number;
  isConfirmed: boolean;
  renewSubscriptionTimestampInSeconds: number;
  wasSuccessNotificationShown: boolean;
  shouldShowTrialExpiredNotification: boolean;
  isResetPasswordActive: boolean;
  isStripeEnabled: boolean;
  isBlocked: boolean;
  isProfessionalTrialAvailable: boolean;
  isSubscriptionActive?: boolean;
  isDowngradeMessageShown: boolean;
}

export interface IUpdateProfile {
  email?: string;
  country?: string;
  companyName: string;
  contactEmail: string;
  businessCategories?: string[];
  description: string;
  languages?: string[];
  fullName: string;
  position: string;
  signBoard?: string;
  stripeAccountId?: string;
  stripeEmail?: string;
  stripeSessionId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionPlanKey?: PlanKeys;
  previousSubscriptionPlanKey?: PlanKeys;
  isSubscriptionActive?: boolean;
  maxTemplatesNumber?: number;
  maxMeetingTime?: number;
  isStripeEnabled?: boolean;
  wasSuccessNotificationShown?: boolean;
  renewSubscriptionTimestampInSeconds?: number;
  isResetPasswordActive?: boolean;
  shouldShowTrialExpiredNotification?: boolean;
  isDowngradeMessageShown?: boolean;
  registerTemplate?: string;
  socials: {
    youtube?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    custom?: string;
  };
}

export interface IUpdateProfileAvatar {
  profileAvatar: string;
  size: number;
  mimeType: string;
}

export interface ITemplateUser {
  id: string;
  profileAvatar: IProfileAvatar;
  maxMeetingTime: ICommonUser['maxMeetingTime'];
}

export interface ICommonUserStatistic {
  user: ICommonUser;
  minutesSpent: number;
  roomsUsed: number;
  moneyEarned: number;
}
