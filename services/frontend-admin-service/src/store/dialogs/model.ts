import {
	AdminDialogsEnum 
} from '../types';
import {
	dialogsDomain 
} from '../domains';

export const $blockUserDialogStore = dialogsDomain.createStore<boolean>(false);
export const $deleteUserDialogStore = dialogsDomain.createStore<boolean>(false);
export const $cancelCreateRoomDialogStore =
    dialogsDomain.createStore<boolean>(false);

export const openAdminDialogEvent = dialogsDomain.createEvent<AdminDialogsEnum>(
	'openAdminDialogEvent',
);
export const closeAdminDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>('openAdminDialogEvent');

export const openBlockUserDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>('openAdminDialogEvent');
export const closeBlockUserDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>('openAdminDialogEvent');

export const openDeleteUserDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>('openAdminDialogEvent');
export const closeDeleteUserDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>('openAdminDialogEvent');

export const openCancelCreateRoomDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>(
    	'openCancelCreateRoomDialogEvent',
    );
export const closeCancelCreateRoomDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>(
    	'closeCancelCreateRoomDialogEvent',
    );
