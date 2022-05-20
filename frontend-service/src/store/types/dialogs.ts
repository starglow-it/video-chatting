export type AppDialogsState = {
    isUserRegisteredDialog: boolean;
    devicesSettingsDialog: boolean;
    endMeetingDialog: boolean;
    inviteAttendeeByEmailDialog: boolean;
    meetingErrorDialog: boolean;
    userToKickDialog: boolean;
    templatePreviewDialog: boolean;
    editMeetingTemplateDialog: boolean;
    confirmChangeRouteDialog: boolean;
    confirmQuitOnboardingDialog: boolean;
    deleteTemplateDialog: boolean;
    scheduleMeetingDialog: boolean;
    downloadIcsEventDialog: boolean;
    copyMeetingLinkDialog: boolean;
};

export enum AppDialogsEnum {
    isUserRegisteredDialog = 'isUserRegisteredDialog',
    devicesSettingsDialog = 'devicesSettingsDialog',
    endMeetingDialog = 'endMeetingDialog',
    inviteAttendeeByEmailDialog = 'inviteAttendeeByEmailDialog',
    meetingErrorDialog = 'meetingErrorDialog',
    userToKickDialog = 'userToKickDialog',
    templatePreviewDialog = 'templatePreviewDialog',
    editMeetingTemplateDialog = 'editMeetingTemplateDialog',
    confirmChangeRouteDialog = 'confirmChangeRouteDialog',
    confirmQuitOnboardingDialog = 'confirmQuitOnboardingDialog',
    deleteTemplateDialog = 'deleteTemplateDialog',
    scheduleMeetingDialog = 'scheduleMeetingDialog',
    downloadIcsEventDialog = 'downloadIcsEventDialog',
    copyMeetingLinkDialog = 'copyMeetingLinkDialog',
}

export type DialogActionPayload = {
    dialogKey: AppDialogsEnum;
};
