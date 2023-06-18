import { ICommonUser } from './users';
import { IUserTemplate } from './templates';
import { MediaCategoryType } from './media';


export enum Environmens {
  Local = 'local',
  Demo = 'demo',
  Production = 'production'
}

export interface IBusinessCategory {
  key: string;
  value: string;
  color: string;
  icon: string;
}

export interface IMediaCategory {
  key: string;
  value: string;
  emojiUrl: string;
  type: MediaCategoryType;
}

export interface ILanguage {
  key: string;
  value: string;
}

export interface ISocialLink {
  key: string;
  value: string;
}

export interface IProfileAvatar {
  id: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface IPreviewImage {
  id: string;
  url: string;
  size: number;
  key: string;
  mimeType: string;
  resolution: number;
}

export interface ICounter {
  key: string;
  value: number;
}

export type ITemplateLink = {
  id: string;
  key: string;
  value: string;
  top: number;
  left: number;
};

export type TemplateLinkPosition = {
  id: string;
  linkIndex: number;
  top: number;
  left: number;
};

export interface IDashboardNotificationUser {
  fullName: ICommonUser['fullName'];
  profileAvatar: ICommonUser['profileAvatar'];
}

export enum DashboardNotificationTypes {
  enterWaitingRoom = 0,
}

export enum DashboardNotificationReadStatus {
  inactive = 0,
  active = 1,
}

export interface IDashboardNotification {
  id: string;
  sentAt: number;
  notificationType: DashboardNotificationTypes;
  status: DashboardNotificationReadStatus;
  template: IUserTemplate;
  sender?: IDashboardNotificationUser;
  receiver: IDashboardNotificationUser;
  isSenderGuest: boolean;
  senderFullName: string;
}

export interface ISendContactsInfo {
  email: string;
  name: string;
  message: string;
}

export enum Counters {
  Templates = 'templates',
}

export enum TimeoutTypesEnum {
  Milliseconds = 'ms',
  Seconds = 's',
  Minutes = 'm',
  Hours = 'h',
  Days = 'd',
  Month = 'mth',
}

export enum MonetizationStatisticPeriods {
  Month = 'lastMonth',
  AllTime = 'allTime',
}

export enum MonetizationStatisticTypes {
  Subscriptions = 'subscriptions',
  PurchaseRooms = 'rooms',
  SellRooms = 'sellRooms',
  RoomTransactions = 'roomCalls',
}

export enum KickUserReasons {
  Blocked = 'blocked',
  Deleted = 'deleted',
}

export enum PlanKeys {
  House = "House",
  Professional = "Professional",
  Business = "Business",
}

export enum PriceValues {
  Free = 'free',
  Paid = 'paid',
}

export enum PriceLabels {
  Free = 'Free',
  Paid = 'Paid',
}
