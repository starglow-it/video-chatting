import { MeetingRole, PlanKeys } from 'shared-types';

export type PlanData = {
  name: PlanKeys;
  key: string;
  priceInCents: number;
  description: string;
  features: {
    templatesLimit: number;
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
      lurker: 0.1,
      participant: 0.1,
    },
  },
};

const professionalSubscription: PlanData = {
  name: PlanKeys.Professional,
  key: 'professional',
  priceInCents: 500,
  description: 'Monetize meetings + upload room',
  features: {
    templatesLimit: 20,
    timeLimit: null,
    comissionFee: {
      lurker: 0.05,
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
  description: 'No platform commission + embed link',
  features: {
    templatesLimit: 50,
    timeLimit: null,
    comissionFee: {
      lurker: 0.5,
      participant: 0
    },
  },
};

export const plans: Record<PlanKeys, PlanData> = {
  Business: businessSubscription,
  Professional: professionalSubscription,
  House: houseSubscription,
};
