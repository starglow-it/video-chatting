import {DashboardNotificationReadStatus, DashboardNotificationTypes} from "../types/dashboard-notification.type";
import {IUserTemplate} from "./user-template.interface";
import {IDashboardNotificationUser} from "./dashboard-notification-user.interface";

export interface IDashboardNotification {
    id: string;
    sentAt: number;
    notificationType: DashboardNotificationTypes;
    status: DashboardNotificationReadStatus;
    template: IUserTemplate;
    sender: IDashboardNotificationUser;
    receiver: IDashboardNotificationUser;
}