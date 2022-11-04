import {DashboardNotificationTypes, ICommonUser, IDashboardNotification, IUserTemplate} from "../api-interfaces";

export type ReadNotificationsPayload = {
    receiverId: string;
    notifications: IDashboardNotification["id"][];
};

export type GetNotificationsPayload = { receiverId: string };

export type CreateNotificationPayload = {
    templateId: IUserTemplate["id"];
    senderId: ICommonUser["id"];
    notificationType: DashboardNotificationTypes;
    senderFullName: string;
};

export type CreateSubscriptionNotificationPayload = {
    subscriptionId: string;
    notificationType: DashboardNotificationTypes;
};
