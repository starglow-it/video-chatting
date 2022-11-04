import {ICommonUser} from "./users";
import {IUserTemplate} from "./templates";

export interface IBusinessCategory {
    key: string;
    value: string;
    color: string;
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
    size: number
    mimeType: string;
}

export interface IPreviewImage {
    id: string;
    url: string;
    size: number
    mimeType: string;
    resolution: number;
}

export interface ICounter {
    key: string;
    value: number;
}

export interface IDashboardNotificationUser {
    fullName: ICommonUser["fullName"]
    profileAvatar: ICommonUser["profileAvatar"]
}

export enum DashboardNotificationTypes {
    enterWaitingRoom = 0
}

export enum DashboardNotificationReadStatus {
    inactive = 0,
    active = 1
}

export interface IDashboardNotification {
    id: string;
    sentAt: number;
    notificationType: DashboardNotificationTypes;
    status: DashboardNotificationReadStatus;
    template: IUserTemplate;
    sender: IDashboardNotificationUser;
    receiver: IDashboardNotificationUser;
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