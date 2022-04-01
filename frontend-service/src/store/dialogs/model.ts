import { root } from '../root';
import { AppDialogsState } from '../types';

export const dialogsDomain = root.domain('dialogs');

export const initialDialogsState: AppDialogsState = {
    isUserRegisteredDialog: false,
    devicesSettingsDialog: false,
    endMeetingDialog: false,
    inviteAttendeeByEmailDialog: false,
    meetingErrorDialog: false,
    userToKickDialog: false,
    templatePreviewDialog: false,
    editMeetingTemplateDialog: false,
    confirmChangeRouteDialog: false,
    confirmQuitOnboardingDialog: false,
    deleteTemplateDialog: false,
};

export const $appDialogsStore = dialogsDomain.store<AppDialogsState>(initialDialogsState);