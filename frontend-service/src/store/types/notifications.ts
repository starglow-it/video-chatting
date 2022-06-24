export enum NotificationType {
    MicAction = 'mic_action',
    CamAction = 'camera_action',
    DevicesAction = 'devices_action',
    MeetingInfoCopied = 'meeting_info_copied',
    LinkInfoCopied = 'link_copied',
    PasswordChanged = 'password_changed',
    PaymentSuccess = 'payment_success',
    PaymentFail = 'password_fail',
}

export type Notification = {
    type: NotificationType,
    message: string;
    withSuccessIcon?: boolean;
    withErrorIcon?: boolean
}
