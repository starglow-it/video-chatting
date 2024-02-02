import { ICommonTemplate, IUserTemplate } from './templates';
import { ICommonUser, ICommonUserStatistic } from './users';
import { EntityList } from '../common';
import { IBusinessCategory } from './common';

export type StatisticBase<Type> = {
  totalNumber: number;
  data: Type;
};

export interface ICountryStatistic {
  key: string;
  value: number;
  color: string;
}
export interface AttendeesNumbers {
  totalNumber: number;
  participants: number;
  audience: number;
  participantsAvgMin: number;
  audienceAvgMin: number;
}
export interface LocationStatistics {
  data: {country: string, state?: { name: string, num: number }[], num: number}[]
}
export interface qaStatistics {
  data: {
    questions: { content: string, who: string, answered: boolean }[]
  }
}
export interface linksStatistics {
  data: { link: string, clicks: number, clickThroughRate: number }[]
}
export interface monetizationStatistics {
  data: { entryFee: number, total: number, donations: number }
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
  id: string;
  template: ICommonTemplate;
  author: ICommonUser;
  transactions: number;
  minutes: number;
  calls: number;
  money: number;
  uniqueUsers: number;
}
export interface IRooms {
  id: string;
  template: { name: string };
  updatedAt: string;
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

export type MeetingAttendeesStatistics = {
  total: number;
  participants: number;
  audiences: number;
  participantsAvgMin: number;
  audienceAvgMin: number;
};
export type Rooms = StatisticBase<IRooms[]>;
export type RoomsStatistics = StatisticBase<IRoomsStatistics[]>;
export type RoomRatingStatistics = StatisticBase<IRoomsRatingStatistic[]>;
export type MonetizationStatistics = StatisticBase<IMonetizationStatistic[]>;
export type UsersList = EntityList<ICommonUser>;
export type CommonTemplatesList = EntityList<ICommonTemplate>;
export type UserProfileId = ICommonUser['id'] | null;
export type UserProfile = ICommonUser | null;
export type UserProfileStatistic = ICommonUserStatistic | null;
export type UserProfileTemplate = IUserTemplate | null | undefined;
export type ProfileTemplatesCount = { count: number };
export type BusinessCategoryList = EntityList<IBusinessCategory>;
