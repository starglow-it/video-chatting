import {
    $notificationsStore,
    $orangeNotificationsStore,
    addNotificationEvent,
    removeNotification,
    addOrangeNotificationEvent,
    removeOrangeNotification
} from './model';
import { Notification } from '../types';

$notificationsStore
    .on(addNotificationEvent, (state, payload: Notification) => [
        state[state.length - 1],
        payload,
    ])
    .on(removeNotification, state => state.slice(1));

$orangeNotificationsStore
    .on(addOrangeNotificationEvent, (state, payload: Notification) => [
        state[state.length - 1],
        payload,
    ])
    .on(removeOrangeNotification, state => state.slice(1));
