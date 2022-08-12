export enum NotificationType {
    MicAction = 'mic_action',
    CamAction = 'camera_action',
    DevicesAction = 'devices_action',
    MeetingInfoCopied = 'meeting_info_copied',
    LinkInfoCopied = 'link_copied',
    PasswordChanged = 'password_changed',
    PaymentSuccess = 'payment_success',
    PaymentFail = 'password_fail',
    copyNotification = 'text_copied',
    SubscriptionSuccess = 'subscription_success',
    NoTimeLeft = 'no_time_left',
}

export type Notification = {
    type: NotificationType;
    message: string;
    withSuccessIcon?: boolean;
    withErrorIcon?: boolean;
    withManualClose?: boolean;
};
