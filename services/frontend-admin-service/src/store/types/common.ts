export enum AdminDialogsEnum {
    blockUserDialog = 'blockUserDialog',
    deleteUserDialog = 'deleteUserDialog',
    confirmCreateAndPublishRoomDialog = 'confirmCreateAndPublishRoomDialog',
    cancelCreateRoomDialog = 'cancelCreateRoomDialog',
    cancelEditRoomDialog = 'cancelEditRoomDialog',
    roomPreviewDialog = 'roomPreviewDialog',
    publishRoomDialog = 'publishRoomDialog',
    revokeRoomDialog = 'revokeRoomDialog',
    saveRoomChangesDialog = 'saveRoomChangesDialog',
    confirmDeleteRoomDialog = 'confirmDeleteRoomDialog',
    confirmDeleteMediaDialog = 'confirmDeleteMediaDialog',
    confirmDeleteCategoryDialog = 'confirmDeleteCategoryDialog'
}

export enum NotificationType {
    userBlocked = 'userBlocked',
    userUnBlocked = 'userUnBlocked',
    userDeleted = 'userDeleted',
    UploadFileFail = 'UploadFileFail',
    roomPublished = 'roomPublished',
    roomChangesSaved = 'roomChangesSaved',
    roomRevoked = 'roomPublished',
    validationError = 'validationError',
    BackgroundFileShouldBeUploaded = 'BackgroundFileShouldBeUploaded',
}

export type Notification = {
    type: NotificationType;
    message: string;
    messageOptions?: Record<string, string | number>;
    withSuccessIcon?: boolean;
    withErrorIcon?: boolean;
    withManualClose?: boolean;
    iconType?: string;
};
