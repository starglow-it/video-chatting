export enum AdminDialogsEnum {
    blockUserDialog = 'blockUserDialog',
    deleteUserDialog = 'deleteUserDialog',
    cancelCreateRoomDialog = 'cancelCreateRoomDialog',
}

export enum NotificationType {
    userBlocked = 'userBlocked',
    userUnBlocked = 'userUnBlocked',
    userDeleted = 'userDeleted',
}

export type Notification = {
    type: NotificationType;
    message: string;
    messageOptions?: { [key: string]: any };
    withSuccessIcon?: boolean;
    withErrorIcon?: boolean;
    withManualClose?: boolean;
    iconType?: string;
};
