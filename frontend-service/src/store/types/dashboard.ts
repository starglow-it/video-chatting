import {UserTemplate} from "./template";
import {Profile} from "./profile";

export enum DashboardNotificationTypes {
    enterWaitingRoom = 0
}

export enum DashboardNotificationReadStatus {
    inactive = 0,
    active = 1
}

export type DashboardNotificationUser =  {
    fullName: Profile["fullName"]
    profileAvatar?: Profile["profileAvatar"]
}

export type DashboardNotification = {
    id: string;
    template: UserTemplate;
    notificationType: DashboardNotificationTypes;
    sender: DashboardNotificationUser;
    sentAt: number;
    status: DashboardNotificationReadStatus;
}