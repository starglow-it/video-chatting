import { split } from 'effector';
import {
    $blockUserDialogStore,
    $cancelCreateRoomDialogStore,
    $cancelEditRoomDialogStore,
    $confirmCreateAndPublishRoomDialogStore,
    $confirmDeleteCategoryDialogStore,
    $confirmDeleteMediaDialogStore,
    $confirmDeleteRoomDialogStore,
    $deleteUserDialogStore,
    $publishRoomDialogStore,
    $revokeRoomDialogStore,
    $roomPreviewDialogStore,
    $saveRoomChangesDialogStore,
    closeAdminDialogEvent,
    closeBlockUserDialogEvent,
    closeCancelCreateRoomDialogEvent,
    closeCancelEditRoomDialogEvent,
    closeConfirmCreateAndPublishRoomDialog,
    closeConfirmDeleteCategoryDialogEvent,
    closeConfirmDeleteMediaDialogEvent,
    closeConfirmDeleteRoomDialogEvent,
    closeDeleteUserDialogEvent,
    closePublishRoomDialogEvent,
    closeRevokeRoomDialogEvent,
    closeRoomPreviewDialogEvent,
    closeSaveRoomChangesDialogEvent,
    openAdminDialogEvent,
    openBlockUserDialogEvent,
    openCancelCreateRoomDialogEvent,
    openCancelEditRoomDialogEvent,
    openConfirmCreateAndPublishRoomDialogEvent,
    openConfirmDeleteCategoryDialogEvent,
    openConfirmDeleteMediaDialogEvent,
    openConfirmDeleteRoomDialogEvent,
    openDeleteUserDialogEvent,
    openPublishRoomDialogEvent,
    openRevokeRoomDialogEvent,
    openRoomPreviewDialogEvent,
    openSaveRoomChangesDialogEvent,
} from './model';
import { AdminDialogsEnum } from '../types';

$blockUserDialogStore
    .on(openBlockUserDialogEvent, () => true)
    .on(closeBlockUserDialogEvent, () => false);

$deleteUserDialogStore
    .on(openDeleteUserDialogEvent, () => true)
    .on(closeDeleteUserDialogEvent, () => false);

$cancelCreateRoomDialogStore
    .on(openCancelCreateRoomDialogEvent, () => true)
    .on(closeCancelCreateRoomDialogEvent, () => false);

$confirmCreateAndPublishRoomDialogStore
    .on(openConfirmCreateAndPublishRoomDialogEvent, () => true)
    .on(closeConfirmCreateAndPublishRoomDialog, () => false);

$roomPreviewDialogStore
    .on(openRoomPreviewDialogEvent, () => true)
    .on(closeRoomPreviewDialogEvent, () => false);

$publishRoomDialogStore
    .on(openPublishRoomDialogEvent, () => true)
    .on(closePublishRoomDialogEvent, () => false);

$revokeRoomDialogStore
    .on(openRevokeRoomDialogEvent, () => true)
    .on(closeRevokeRoomDialogEvent, () => false);

$cancelEditRoomDialogStore
    .on(openCancelEditRoomDialogEvent, () => true)
    .on(closeCancelEditRoomDialogEvent, () => false);

$saveRoomChangesDialogStore
    .on(openSaveRoomChangesDialogEvent, () => true)
    .on(closeSaveRoomChangesDialogEvent, () => false);

$confirmDeleteRoomDialogStore
    .on(openConfirmDeleteRoomDialogEvent, () => true)
    .on(closeConfirmDeleteRoomDialogEvent, () => false);

$confirmDeleteMediaDialogStore
    .on(openConfirmDeleteMediaDialogEvent, () => true)
    .on(closeConfirmDeleteMediaDialogEvent, () => false);

$confirmDeleteCategoryDialogStore
    .on(openConfirmDeleteCategoryDialogEvent, () => true)
    .on(closeConfirmDeleteCategoryDialogEvent, () => false);

const adminDialogCases = {
    blockUserDialog: (type: AdminDialogsEnum) =>
        type === AdminDialogsEnum.blockUserDialog,
    deleteUserDialog: (type: AdminDialogsEnum) =>
        type === AdminDialogsEnum.deleteUserDialog,
    cancelCreateRoomDialog: (type: AdminDialogsEnum) =>
        type === AdminDialogsEnum.cancelCreateRoomDialog,
    confirmCreateAndPublishRoomDialog: (type: AdminDialogsEnum) =>
        type === AdminDialogsEnum.confirmCreateAndPublishRoomDialog,
    roomPreviewDialog: (type: AdminDialogsEnum) =>
        type === AdminDialogsEnum.roomPreviewDialog,
    publishRoomDialog: (type: AdminDialogsEnum) =>
        type === AdminDialogsEnum.publishRoomDialog,
    revokeRoomDialog: (type: AdminDialogsEnum) =>
        type === AdminDialogsEnum.revokeRoomDialog,
    cancelEditRoomDialog: (type: AdminDialogsEnum) =>
        type === AdminDialogsEnum.cancelEditRoomDialog,
    saveRoomChangesDialog: (type: AdminDialogsEnum) =>
        type === AdminDialogsEnum.saveRoomChangesDialog,
    confirmDeleteRoomDialog: (type: AdminDialogsEnum) =>
        type === AdminDialogsEnum.confirmDeleteRoomDialog,
    confirmDeleteMediaDialog: (type: AdminDialogsEnum) =>
        type === AdminDialogsEnum.confirmDeleteMediaDialog,
    confirmDeleteCategoryDialog: (type: AdminDialogsEnum) =>
        type === AdminDialogsEnum.confirmDeleteCategoryDialog,
};

split({
    source: openAdminDialogEvent,
    match: adminDialogCases,
    cases: {
        deleteUserDialog: openDeleteUserDialogEvent,
        blockUserDialog: openBlockUserDialogEvent,
        cancelCreateRoomDialog: openCancelCreateRoomDialogEvent,
        confirmCreateAndPublishRoomDialog:
            openConfirmCreateAndPublishRoomDialogEvent,
        roomPreviewDialog: openRoomPreviewDialogEvent,
        publishRoomDialog: openPublishRoomDialogEvent,
        revokeRoomDialog: openRevokeRoomDialogEvent,
        cancelEditRoomDialog: openCancelEditRoomDialogEvent,
        saveRoomChangesDialog: openSaveRoomChangesDialogEvent,
        confirmDeleteRoomDialog: openConfirmDeleteRoomDialogEvent,
        confirmDeleteMediaDialog: openConfirmDeleteMediaDialogEvent,
        confirmDeleteCategoryDialog: openConfirmDeleteCategoryDialogEvent,
    },
});

split({
    source: closeAdminDialogEvent,
    match: adminDialogCases,
    cases: {
        deleteUserDialog: closeDeleteUserDialogEvent,
        blockUserDialog: closeBlockUserDialogEvent,
        cancelCreateRoomDialog: closeCancelCreateRoomDialogEvent,
        confirmCreateAndPublishRoomDialog:
            closeConfirmCreateAndPublishRoomDialog,
        roomPreviewDialog: closeRoomPreviewDialogEvent,
        publishRoomDialog: closePublishRoomDialogEvent,
        revokeRoomDialog: closeRevokeRoomDialogEvent,
        cancelEditRoomDialog: closeCancelEditRoomDialogEvent,
        saveRoomChangesDialog: closeSaveRoomChangesDialogEvent,
        confirmDeleteRoomDialog: closeConfirmDeleteRoomDialogEvent,
        confirmDeleteMediaDialog: closeConfirmDeleteMediaDialogEvent,
        confirmDeleteCategoryDialog: closeConfirmDeleteCategoryDialogEvent,
    },
});
