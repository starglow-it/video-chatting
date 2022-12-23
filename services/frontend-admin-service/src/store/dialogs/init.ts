import {
	split 
} from 'effector';
import {
	$blockUserDialogStore,
	$cancelCreateRoomDialogStore,
	$confirmCreateAndPublishRoomDialogStore,
	$deleteUserDialogStore, $roomPreviewDialogStore,
	closeAdminDialogEvent,
	closeBlockUserDialogEvent,
	closeCancelCreateRoomDialogEvent,
	closeConfirmCreateAndPublishRoomDialog,
	closeDeleteUserDialogEvent,
	closeRoomPreviewDialog,
	openAdminDialogEvent,
	openBlockUserDialogEvent,
	openCancelCreateRoomDialogEvent,
	openConfirmCreateAndPublishRoomDialog,
	openDeleteUserDialogEvent,
	openRoomPreviewDialog,
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

$confirmCreateAndPublishRoomDialogStore
	.on(openConfirmCreateAndPublishRoomDialog, () => true)
	.on(closeConfirmCreateAndPublishRoomDialog, () => false);

$roomPreviewDialogStore
	.on(openRoomPreviewDialog, () => true)
	.on(closeRoomPreviewDialog, () => false);

split({
	source: openAdminDialogEvent,
	match: {
		blockUserDialog: type => type === AdminDialogsEnum.blockUserDialog,
		deleteUserDialog: type => type === AdminDialogsEnum.deleteUserDialog,
		cancelCreateRoomDialog: type =>
			type === AdminDialogsEnum.cancelCreateRoomDialog,
		confirmCreateAndPublishRoomDialog: type =>
			type === AdminDialogsEnum.confirmCreateAndPublishRoomDialog,
		roomPreviewDialog: type =>
			type === AdminDialogsEnum.roomPreviewDialog,
	},
	cases: {
		deleteUserDialog: openDeleteUserDialogEvent,
		blockUserDialog: openBlockUserDialogEvent,
		cancelCreateRoomDialog: openCancelCreateRoomDialogEvent,
		confirmCreateAndPublishRoomDialog: openConfirmCreateAndPublishRoomDialog,
		roomPreviewDialog: openRoomPreviewDialog,
	},
});

split({
	source: closeAdminDialogEvent,
	match: {
		blockUserDialog: type => type === AdminDialogsEnum.blockUserDialog,
		deleteUserDialog: type => type === AdminDialogsEnum.deleteUserDialog,
		cancelCreateRoomDialog: type =>
			type === AdminDialogsEnum.cancelCreateRoomDialog,
		confirmCreateAndPublishRoomDialog: type =>
			type === AdminDialogsEnum.confirmCreateAndPublishRoomDialog,
		roomPreviewDialog: type =>
			type === AdminDialogsEnum.roomPreviewDialog,
	},
	cases: {
		deleteUserDialog: closeDeleteUserDialogEvent,
		blockUserDialog: closeBlockUserDialogEvent,
		cancelCreateRoomDialog: closeCancelCreateRoomDialogEvent,
		confirmCreateAndPublishRoomDialog: closeConfirmCreateAndPublishRoomDialog,
		roomPreviewDialog: closeRoomPreviewDialog,
	},
});
