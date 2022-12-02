import { PlanKeys } from 'shared-types';

type PlanData = {
  name: PlanKeys;
  key: string;
  priceInCents: number;
  description: string;
  features: {
    templatesLimit: number;
    timeLimit: number;
    comissionFee: number;
  };
  trialPeriodDays?: number;
  testTrialPeriodDays?: number;
};

const houseSubscription: PlanData = {
  name: 'House',
  key: 'house',
  priceInCents: 0,
  description: 'Best for trying and occasional use',
  features: {
    templatesLimit: 1,
    timeLimit: 120 * 60 * 1000,
    comissionFee: 0.0099,
  },
};

const professionalSubscription: PlanData = {
  name: 'Professional',
  key: 'professional',
  priceInCents: 2900,
  description: 'Best for standard use and monetization',
  features: {
    templatesLimit: 2,
    timeLimit: 1200 * 60 * 1000,
    comissionFee: 0,
  },
  trialPeriodDays: 7,
  testTrialPeriodDays: 1,
};

const businessSubscription: PlanData = {
  name: 'Business',
  key: 'business',
  priceInCents: 7900,
  description: 'Best for monetization and frequent use',
  features: {
    templatesLimit: 10,
    timeLimit: null,
    comissionFee: 0,
  },
};

export const plans: Record<PlanKeys, PlanData> = {
  Business: businessSubscription,
  Professional: professionalSubscription,
  House: houseSubscription,
};
