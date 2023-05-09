import { AdminDialogsEnum } from '../types';
import { dialogsDomain } from '../domains';

export const $blockUserDialogStore = dialogsDomain.createStore<boolean>(false);
export const $deleteUserDialogStore = dialogsDomain.createStore<boolean>(false);
export const $cancelCreateRoomDialogStore =
    dialogsDomain.createStore<boolean>(false);

export const $confirmCreateAndPublishRoomDialogStore =
    dialogsDomain.createStore<boolean>(false);

export const $roomPreviewDialogStore =
    dialogsDomain.createStore<boolean>(false);

export const $publishRoomDialogStore =
    dialogsDomain.createStore<boolean>(false);

export const $cancelEditRoomDialogStore =
    dialogsDomain.createStore<boolean>(false);

export const $saveRoomChangesDialogStore =
    dialogsDomain.createStore<boolean>(false);

export const $confirmDeleteRoomDialogStore =
    dialogsDomain.createStore<boolean>(false);

export const $revokeRoomDialogStore = dialogsDomain.createStore<boolean>(false);

export const $confirmDeleteMediaDialogStore =
    dialogsDomain.createStore<boolean>(false);

export const $confirmDeleteCategoryDialogStore =
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

export const openConfirmCreateAndPublishRoomDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>(
        'openConfirmCreateAndPublishRoomDialogEvent',
    );
export const closeConfirmCreateAndPublishRoomDialog =
    dialogsDomain.createEvent<AdminDialogsEnum>(
        'closeConfirmCreateAndPublishRoomDialog',
    );

export const openRoomPreviewDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>('openRoomPreviewDialogEvent');
export const closeRoomPreviewDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>('closeRoomPreviewDialogEvent');

export const openPublishRoomDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>('openPublishRoomDialogEvent');
export const closePublishRoomDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>('closePublishRoomDialogEvent');

export const openRevokeRoomDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>('openRevokeRoomDialogEvent');
export const closeRevokeRoomDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>('closeRevokeRoomDialogEvent');

export const openCancelEditRoomDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>(
        'openCancelEditRoomDialogEvent',
    );
export const closeCancelEditRoomDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>(
        'closeCancelEditRoomDialogEvent',
    );

export const openSaveRoomChangesDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>(
        'openSaveRoomChangesDialogEvent',
    );
export const closeSaveRoomChangesDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>(
        'closeSaveRoomChangesDialogEvent',
    );

export const openConfirmDeleteRoomDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>(
        'openConfirmDeleteRoomDialogEvent',
    );
export const closeConfirmDeleteRoomDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>(
        'closeConfirmDeleteRoomDialogEvent',
    );

export const openConfirmDeleteMediaDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>(
        'openConfirmDeleteMediaDialogEvent',
    );
export const closeConfirmDeleteMediaDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>(
        'closeConfirmDeleteMediaDialogEvent',
    );

export const openConfirmDeleteCategoryDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>(
        'openConfirmDeleteMediaDialogEvent',
    );
export const closeConfirmDeleteCategoryDialogEvent =
    dialogsDomain.createEvent<AdminDialogsEnum>(
        'closeConfirmDeleteMediaDialogEvent',
    );
