import { ICommonTemplate, IUserTemplate } from './templates';
import { ICommonUser, ICommonUserStatistic } from './users';
import { EntityList } from '../common';

export type StatisticBase<Type> = {
  totalNumber: number;
  data: Type;
};

export interface ICountryStatistic {
  key: string;
  value: number;
  color: string;
}

export interface ISubscriptionsStatistics {
  label: string;
  value: number;
  color: string;
}

export interface IRoomsStatistics {
  label: string;
  value: number;
  color: string;
}

export interface IRoomsRatingStatistic {
  template: ICommonTemplate;
  author: ICommonUser;
  transactions: number;
  minutes: number;
  calls: number;
  money: number;
  uniqueUsers: number;
}

export interface IMonetizationStatistic {
  key: string;
  type: string;
  value: number;
}

export type UserStatistics = StatisticBase<ICountryStatistic[]>;
export type SubscriptionsStatisticsType = StatisticBase<
  ISubscriptionsStatistics[]
>;
export type RoomsStatistics = StatisticBase<IRoomsStatistics[]>;
export type RoomRatingStatistics = StatisticBase<IRoomsRatingStatistic[]>;
export type MonetizationStatistics = StatisticBase<IMonetizationStatistic[]>;
export type UsersList = EntityList<ICommonUser>;
export type UserProfileId = ICommonUser['id'] | null;
export type UserProfile = ICommonUser | null;
export type UserProfileStatistic = ICommonUserStatistic | null;
export type UserProfileTemplate = IUserTemplate | null | undefined;
export type ProfileTemplatesCount = { count: number };
