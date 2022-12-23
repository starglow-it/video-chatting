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

export const $confirmCreateAndPublishRoomDialogStore =
    dialogsDomain.createStore<boolean>(false);

export const $roomPreviewDialogStore =
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

export const openConfirmCreateAndPublishRoomDialog =
    dialogsDomain.createEvent<AdminDialogsEnum>(
    	'openConfirmCreateAndPublishRoomDialog',
    );
export const closeConfirmCreateAndPublishRoomDialog =
    dialogsDomain.createEvent<AdminDialogsEnum>(
    	'closeConfirmCreateAndPublishRoomDialog',
    );

export const openRoomPreviewDialog =
    dialogsDomain.createEvent<AdminDialogsEnum>(
    	'openRoomPreviewDialog',
    );
export const closeRoomPreviewDialog =
    dialogsDomain.createEvent<AdminDialogsEnum>(
    	'closeRoomPreviewDialog',
    );
