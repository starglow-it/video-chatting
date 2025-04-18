import { AppDialogsState } from '../types';
import { dialogsDomain } from '../domains';

export const initialDialogsState: AppDialogsState = {
    isUserRegisteredDialog: false,
    devicesSettingsDialog: false,
    endMeetingDialog: false,
    meetingEndDialog: false,
    inviteAttendeeByEmailDialog: false,
    meetingErrorDialog: false,
    userToKickDialog: false,
    userToAudienceDialog: false,
    templatePreviewDialog: false,
    editMeetingTemplateDialog: false,
    confirmChangeRouteDialog: false,
    confirmQuitOnboardingDialog: false,
    deleteTemplateDialog: false,
    scheduleMeetingDialog: false,
    downloadIcsEventDialog: false,
    copyMeetingLinkDialog: false,
    emailResetPasswordDialog: false,
    deleteProfileDialog: false,
    replaceTemplateConfirmDialog: false,
    timeExpiredDialog: false,
    hostTimeExpiredDialog: false,
    confirmCancelRoomCreationDialog: false,
    userBlockedDialog: false,
    hostUserDeletedDialog: false,
    downgradedSubscriptionDialog: false,
    meetingFinishedDialog: false,
    inviteGuestsDialog: false,
    inviteGuestsDialogCountTimeStart: false,
    confirmBecomeParticipantDialog: false,
    confirmBecomeAudienceDialog: false,
    hostDeviceRequireDialog: false,
    recordVideoDownloadDialog: false,
    payToAddNewTeamMemberDialog: false,
    mobilePopUpDialog: false
};

export const $appDialogsStore =
    dialogsDomain.createStore<AppDialogsState>(initialDialogsState);
