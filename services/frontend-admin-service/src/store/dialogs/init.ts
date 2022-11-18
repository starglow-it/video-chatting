import { split } from 'effector';
import {
    $blockUserDialogStore,
    $deleteUserDialogStore,
    closeAdminDialogEvent,
    closeBlockUserDialogEvent,
    closeDeleteUserDialogEvent,
    openAdminDialogEvent,
    openBlockUserDialogEvent,
    openDeleteUserDialogEvent
} from './model';
import { AdminDialogsEnum } from '../types';

$blockUserDialogStore
    .on(openBlockUserDialogEvent, () => true)
    .on(closeBlockUserDialogEvent, () => false)

$deleteUserDialogStore
    .on(openDeleteUserDialogEvent, () => true)
    .on(closeDeleteUserDialogEvent, () => false)

split({
    source: openAdminDialogEvent,
    match: {
        blockUserDialog: type => type === AdminDialogsEnum.blockUserDialog,
        deleteUserDialog: type => type === AdminDialogsEnum.deleteUserDialog
    },
    cases: {
        deleteUserDialog: openDeleteUserDialogEvent,
        blockUserDialog: openBlockUserDialogEvent
    }
});

split({
    source: closeAdminDialogEvent,
    match: {
        blockUserDialog: type => type === AdminDialogsEnum.blockUserDialog,
        deleteUserDialog: type => type === AdminDialogsEnum.deleteUserDialog
    },
    cases: {
        deleteUserDialog: closeDeleteUserDialogEvent,
        blockUserDialog: closeBlockUserDialogEvent
    }
})
