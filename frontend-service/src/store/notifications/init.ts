import { $notificationsStore, addNotificationEvent, removeNotification } from './model';

$notificationsStore
    .on(addNotificationEvent, (state, payload) => [state[state.length - 1], payload])
    .on(removeNotification, state => state.slice(1));
