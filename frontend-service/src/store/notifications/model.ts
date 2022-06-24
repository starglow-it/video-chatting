import { root } from '../root';
import {Notification} from "../types";

const notificationsDomain = root.createDomain('notificationsDomain');

export const $notificationsStore = notificationsDomain.store<Notification[]>([]);

export const addNotificationEvent = notificationsDomain.event<Notification>('addNotificationEvent');
export const removeNotification = notificationsDomain.event('removeNotification');
