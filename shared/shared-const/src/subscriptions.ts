import {
  MeetingRole,
  MonetizationStatisticPeriods,
  MonetizationStatisticTypes,
} from 'shared-types';

export const planColors: Record<string, string> = {
  House: '#69E071',
  Professional: '#2E6DF2',
  Business: '#FFB84E',
  AllPlans: '#0F0F10',
};

export const monetizationStatisticsData = [
  {
    key: MonetizationStatisticPeriods.AllTime,
    type: MonetizationStatisticTypes.Subscriptions,
  },
  {
    key: MonetizationStatisticPeriods.Month,
    type: MonetizationStatisticTypes.Subscriptions,
  },
  {
    key: MonetizationStatisticPeriods.AllTime,
    type: MonetizationStatisticTypes.PurchaseRooms,
  },
  {
    key: MonetizationStatisticPeriods.Month,
    type: MonetizationStatisticTypes.PurchaseRooms,
  },
  {
    key: MonetizationStatisticPeriods.AllTime,
    type: MonetizationStatisticTypes.SellRooms,
  },
  {
    key: MonetizationStatisticPeriods.Month,
    type: MonetizationStatisticTypes.SellRooms,
  },
  {
    key: MonetizationStatisticPeriods.AllTime,
    type: MonetizationStatisticTypes.RoomTransactions,
  },
  {
    key: MonetizationStatisticPeriods.Month,
    type: MonetizationStatisticTypes.RoomTransactions,
  },
];

export enum StripeCurrency {
  USD = 'USD',
  CAD = 'CAD',
  GBP = 'GBP',
  EUR = 'EUR',
  INR = 'INR',
  AUS = 'AUS',
}

export enum PaymentType {
  Meeting = 'meeting',
  Paywall = 'paywall',
}

export const DEFAULT_PAYMENT_CURRENCY = StripeCurrency.USD;
export const DEFAULT_PRICE: { [K in Exclude<MeetingRole, 'host'>]: number } = {
  recorder: 0,
  audience: 3,
  participant: 5,
};
