import { MeetingRole, PlanKeys } from 'shared-types';
import { emailTemplates } from './email-templates.const';

export type PlanData = {
  name: PlanKeys;
  key: string;
  priceInCents: number;
  description: string;
  features: {
    templatesLimit: number;
    emailSlug?: keyof typeof emailTemplates;
    timeLimit: number;
    comissionFee: {
      [T in Exclude<MeetingRole, 'host'>]: number;
    };
  };
  trialPeriodDays?: number;
  testTrialPeriodDays?: number;
};

const houseSubscription: PlanData = {
  name: PlanKeys.House,
  key: 'house',
  priceInCents: 0,
  description: 'Discover Stree-fee video settings',
  features: {
    templatesLimit: 1,
    timeLimit: null,
    comissionFee: {
      recorder: 0,
      audience: 0.3,
      participant: 0.2,
    },
  },
};

const professionalSubscription: PlanData = {
  name: PlanKeys.Professional,
  key: 'professional',
  priceInCents: 500,
  description: 'Monetize meetings + upload room',
  features: {
    emailSlug: 'subscriptionSuccessful',
    templatesLimit: 20,
    timeLimit: null,
    comissionFee: {
      recorder: 0,
      audience: 0.2,
      participant: 0.05,
    },
  },
  trialPeriodDays: 7,
  testTrialPeriodDays: 1,
};

const businessSubscription: PlanData = {
  name: PlanKeys.Business,
  key: 'business',
  priceInCents: 2500,
  description: 'Add Links to your content',
  features: {
    emailSlug: 'subscriptionBusiness',
    templatesLimit: 50,
    timeLimit: null,
    comissionFee: {
      recorder: 0,
      audience: 0.1,
      participant: 0,
    },
  },
};

export const plans: Record<PlanKeys, PlanData> = {
  Business: businessSubscription,
  Professional: professionalSubscription,
  House: houseSubscription,
};
