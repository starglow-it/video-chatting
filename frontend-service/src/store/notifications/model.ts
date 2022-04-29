import { root } from '../root';

const notificationsDomain = root.createDomain('notificationsDomain');

export const $notificationsStore = notificationsDomain.store<Notification[]>([]);
export const addNotificationEvent = notificationsDomain.event<any>('addNotificationEvent');
export const removeNotification = notificationsDomain.event('removeNotification');
