import { IDashboardNotification } from "../../interfaces/dashboard-notification.interface";
import { IUserTemplate } from "../../interfaces/user-template.interface";
import { ICommonUserDTO } from "../../interfaces/common-user.interface";
import { DashboardNotificationTypes } from "../../types/dashboard-notification.type";

export type ReadNotificationsPayload = {
  receiverId: string;
  notifications: IDashboardNotification["id"][];
};

export type GetNotificationsPayload = { receiverId: string };

export type CreateNotificationPayload = {
  templateId: IUserTemplate["id"];
  senderId: ICommonUserDTO["id"];
  notificationType: DashboardNotificationTypes;
  senderFullName: string;
};
