import {IUserTemplate} from "./user-template.interface";
import {ICommonUserDTO} from "./common-user.interface";
import { DashboardNotificationTypes } from "../types/dashboard-notification.type";

export interface ICreateDashboardNotification {
    templateId: IUserTemplate["id"];
    senderId: ICommonUserDTO["id"];
    notificationType: DashboardNotificationTypes;
    senderFullName: string;
}