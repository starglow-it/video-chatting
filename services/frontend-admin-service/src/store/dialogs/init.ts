import {
	split 
} from 'effector';
import {
	$blockUserDialogStore,
	$cancelCreateRoomDialogStore,
	$deleteUserDialogStore,
	closeAdminDialogEvent,
	closeBlockUserDialogEvent,
	closeCancelCreateRoomDialogEvent,
	closeDeleteUserDialogEvent,
	openAdminDialogEvent,
	openBlockUserDialogEvent,
	openCancelCreateRoomDialogEvent,
	openDeleteUserDialogEvent,
} from './model';
import {
	AdminDialogsEnum 
} from '../types';

$blockUserDialogStore
	.on(openBlockUserDialogEvent, () => true)
	.on(closeBlockUserDialogEvent, () => false);

$deleteUserDialogStore
	.on(openDeleteUserDialogEvent, () => true)
	.on(closeDeleteUserDialogEvent, () => false);

$cancelCreateRoomDialogStore
	.on(openCancelCreateRoomDialogEvent, () => true)
	.on(closeCancelCreateRoomDialogEvent, () => false);

split({
	source: openAdminDialogEvent,
	match: {
		blockUserDialog: type => type === AdminDialogsEnum.blockUserDialog,
		deleteUserDialog: type => type === AdminDialogsEnum.deleteUserDialog,
		cancelCreateRoomDialog: type => type === AdminDialogsEnum.cancelCreateRoomDialog,
	},
	cases: {
		deleteUserDialog: openDeleteUserDialogEvent,
		blockUserDialog: openBlockUserDialogEvent,
		cancelCreateRoomDialog: openCancelCreateRoomDialogEvent,
	},
});

split({
	source: closeAdminDialogEvent,
	match: {
		blockUserDialog: type => type === AdminDialogsEnum.blockUserDialog,
		deleteUserDialog: type => type === AdminDialogsEnum.deleteUserDialog,
		cancelCreateRoomDialog: type => type === AdminDialogsEnum.cancelCreateRoomDialog,
	},
	cases: {
		deleteUserDialog: closeDeleteUserDialogEvent,
		blockUserDialog: closeBlockUserDialogEvent,
		cancelCreateRoomDialog: closeCancelCreateRoomDialogEvent,
	},
});
