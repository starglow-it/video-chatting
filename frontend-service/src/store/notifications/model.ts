import { Notification } from '../types';
import { notificationsDomain } from '../domains';

export const $notificationsStore = notificationsDomain.createStore<Notification[]>([]);

export const addNotificationEvent =
    notificationsDomain.createEvent<Notification>('addNotificationEvent');
export const removeNotification = notificationsDomain.createEvent<void>('removeNotification');
