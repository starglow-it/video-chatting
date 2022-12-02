import {
	$notificationsStore,
	addNotificationEvent,
	removeNotification,
} from './model';
import {
	Notification 
} from '../types';

$notificationsStore
	.on(addNotificationEvent, (state, payload: Notification) => [
		state[state.length - 1],
		payload,
	])
	.on(removeNotification, state => state.slice(1));
