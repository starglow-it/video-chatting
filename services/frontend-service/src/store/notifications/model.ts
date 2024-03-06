import { Notification } from '../types';
import { notificationsDomain } from '../domains';

export const $notificationsStore = notificationsDomain.createStore<
    Notification[]
>([]);
export const $orangeNotificationsStore = notificationsDomain.createStore<
    Notification[]
>([]);

export const addNotificationEvent =
    notificationsDomain.createEvent<Notification>('addNotificationEvent');
export const removeNotification =
    notificationsDomain.createEvent<void>('removeNotification');

export const addOrangeNotificationEvent =
    notificationsDomain.createEvent<Notification>('addOrangeNotificationEvent');
export const removeOrangeNotification =
    notificationsDomain.createEvent<void>('removeOrangeNotification');
