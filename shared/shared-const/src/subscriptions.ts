import {
  MonetizationStatisticPeriods,
  MonetizationStatisticTypes,
} from 'shared-types';

export const planColors: Record<string, string> = {
  House: '#30BE39',
  Professional: '#2E6DF2',
  Business: '#FF884E',
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
