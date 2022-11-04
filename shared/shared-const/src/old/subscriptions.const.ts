const houseSubscription = {
  name: "House",
  key: "house",
  priceInCents: 0,
  description: "Best for trying and occasional use",
  features: {
    templatesLimit: 1,
    timeLimit: 120 * 60 * 1000,
    comissionFee: 0.0099,
  },
};

const professionalSubscription = {
  name: "Professional",
  key: "professional",
  priceInCents: 2900,
  description: "Best for standard use and monetization",
  features: {
    templatesLimit: 2,
    timeLimit: 1200 * 60 * 1000,
    comissionFee: 0,
  },
  trialPeriodDays: 7,
};

const businessSubscription = {
  name: "Business",
  key: "business",
  priceInCents: 7900,
  description: "Best for monetization and frequent use",
  features: {
    templatesLimit: 10,
    timeLimit: null,
    comissionFee: 0,
  },
};

export const plans = {
  Business: businessSubscription,
  Professional: professionalSubscription,
  House: houseSubscription,
};
