import { Socket } from 'socket.io-client';
import {
    ErrorState,
    ICommonTemplate,
    MeetingAccessStatusEnum,
    ProfileTemplatesCount,
    StateWithError,
    TokenPair,
    IUserTemplate,
    ICommonUser,
    MeetingRole,
    MeetingReactionKind,
    RegisterType,
} from 'shared-types';
import { NextPageContext } from 'next';
import { PaymentType } from 'shared-const';

export type Profile = ICommonUser;

export type MeetingUser = {
    id: string;
    profileId: string;
    socketId: string;
    username: string;
    accessStatus: MeetingAccessStatusEnum;
    cameraStatus: string;
    micStatus: string;
    profileAvatar: string;
    isGenerated: boolean;
    isAuraActive: boolean;
    meeting: string;
    userPosition?: {
        bottom: number;
        left: number;
    };
    userSize?: number;
    meetingAvatarId?: string;
    meetingRole: MeetingRole;
    doNotDisturb: boolean;
    isDonated: boolean;
    isPaywallPaid: boolean;
};

export type userLocation = {
    country: string;
    state: string;
};

export type joyride = {
    runDashboardJoyride: boolean,
    runMeetingJoyride: boolean
};

export type Meeting = {
    id: string;
    isMonetizationEnabled?: boolean;
    sharingUserId?: string | null;
    endsAt?: number;
    startAt?: number;
    mode: string;
    hostUserId: string;
    owner: MeetingUser['id'];
    ownerProfileId: MeetingUser['profileId'];
    users: MeetingUser[];
    volume: number;
    isMute: boolean;
    isBlockAudiences?: boolean;
};

export type MeetingChat = {
    id: string;
    sender: MeetingUser;
    body: string;
    meeting: Meeting;
    createdAt: Date;
    reactions: { [K in MeetingReactionKind]: string[] };
};

export type MeetingChatReaction = {
    id: string;
    meetingChat: MeetingChat;
    user: MeetingUser;
    kind: MeetingReactionKind;
};

export type MeetingQuestionAnswer = {
    id: string;
    sender: MeetingUser;
    body: string;
    meeting: Meeting;
    createdAt: Date;
    reactions: { [K in MeetingReactionKind]: string[] };
};

export type MeetingQuestionAnswerReaction = {
    id: string;
    meetingQuestionAnswer: MeetingQuestionAnswer;
    user: MeetingUser;
    kind: MeetingReactionKind;
};

export type AuthUserState = {
    isAuthenticated: boolean;
    error?: ErrorState | null;
    user?: Profile;
    isWithoutAuthen?: boolean;
    isFirstLogin?: boolean;
};

export type LoginUserParams = {
    email: string;
    password: string;
};

export type SeatLoginUserParams = {
    email: string;
    password: string;
    hostId: string;
};

export type GoogleVerfifyParams = {
    token: string;
};

export type RegisteredUserState = {
    isUserRegistered?: boolean;
    isUserConfirmed?: boolean;
    error?: ErrorState | null;
    email?: string;
    password?: string;
};

export type RegisterUserParams = {
    email: string;
    password: string;
    templateId?: ICommonTemplate['id'];
    registerType?: RegisterType;
};

export type SeatRegisterUserParams = {
    email: string;
    password: string;
    profileId?: string;
    hostId: string;
    templateId?: ICommonTemplate['id'];
    registerType?: RegisterType;
};

export type LoginUserResponse = { user: Profile } & TokenPair & {
    isFirstLogin: boolean;
};
export type LoginUserPayload = { email: string; password: string };
export type SeatLoginUserPayload = { email: string; password: string; hostId: string; };

export type JoinMeetingResult = {
    user?: MeetingUser;
    meeting?: Meeting;
    users?: MeetingUser[];
};

export enum DashboardNotificationTypes {
    enterWaitingRoom = 0,
}

export enum DashboardNotificationReadStatus {
    inactive = 0,
    active = 1,
}

export type DashboardNotificationUser = {
    fullName: Profile['fullName'];
    profileAvatar?: Profile['profileAvatar'];
};

export type DashboardNotification = {
    id: string;
    template: IUserTemplate;
    notificationType: DashboardNotificationTypes;
    sender: DashboardNotificationUser;
    senderFullName: string;
    sentAt: number;
    status: DashboardNotificationReadStatus;
};

export type welcomeTour = {
    status: boolean;
};

export type AppDialogsState = {
    isUserRegisteredDialog: boolean;
    devicesSettingsDialog: boolean;
    endMeetingDialog: boolean;
    inviteAttendeeByEmailDialog: boolean;
    meetingErrorDialog: boolean;
    userToKickDialog: boolean;
    userToAudienceDialog: boolean;
    templatePreviewDialog: boolean;
    editMeetingTemplateDialog: boolean;
    confirmChangeRouteDialog: boolean;
    confirmQuitOnboardingDialog: boolean;
    deleteTemplateDialog: boolean;
    scheduleMeetingDialog: boolean;
    downloadIcsEventDialog: boolean;
    copyMeetingLinkDialog: boolean;
    emailResetPasswordDialog: boolean;
    deleteProfileDialog: boolean;
    replaceTemplateConfirmDialog: boolean;
    timeExpiredDialog: boolean;
    hostTimeExpiredDialog: boolean;
    confirmCancelRoomCreationDialog: boolean;
    userBlockedDialog: boolean;
    hostUserDeletedDialog: boolean;
    downgradedSubscriptionDialog: boolean;
    meetingFinishedDialog: boolean;
    inviteGuestsDialog: boolean;
    inviteGuestsDialogCountTimeStart: boolean,
    confirmBecomeParticipantDialog: boolean;
    confirmBecomeAudienceDialog: boolean;
    meetingEndDialog: boolean;
    hostDeviceRequireDialog: boolean;
    recordVideoDownloadDialog: boolean;
    payToAddNewTeamMemberDialog: boolean;
    mobilePopUpDialog: boolean;
};

export enum AppDialogsEnum {
    isUserRegisteredDialog = 'isUserRegisteredDialog',
    devicesSettingsDialog = 'devicesSettingsDialog',
    endMeetingDialog = 'endMeetingDialog',
    inviteAttendeeByEmailDialog = 'inviteAttendeeByEmailDialog',
    meetingErrorDialog = 'meetingErrorDialog',
    userToKickDialog = 'userToKickDialog',
    userToAudienceDialog = 'userToAudienceDialog',
    templatePreviewDialog = 'templatePreviewDialog',
    editMeetingTemplateDialog = 'editMeetingTemplateDialog',
    confirmChangeRouteDialog = 'confirmChangeRouteDialog',
    confirmQuitOnboardingDialog = 'confirmQuitOnboardingDialog',
    deleteTemplateDialog = 'deleteTemplateDialog',
    scheduleMeetingDialog = 'scheduleMeetingDialog',
    downloadIcsEventDialog = 'downloadIcsEventDialog',
    copyMeetingLinkDialog = 'copyMeetingLinkDialog',
    emailResetPasswordDialog = 'emailResetPasswordDialog',
    deleteProfileDialog = 'deleteProfileDialog',
    replaceTemplateConfirmDialog = 'replaceTemplateConfirmDialog',
    timeExpiredDialog = 'timeExpiredDialog',
    confirmCancelRoomCreationDialog = 'confirmCancelRoomCreationDialog',
    hostTimeExpiredDialog = 'hostTimeExpiredDialog',
    hostUserDeletedDialog = 'hostUserDeletedDialog',
    userBlockedDialog = 'userBlockedDialog',
    downgradedSubscriptionDialog = 'downgradedSubscriptionDialog',
    meetingFinishedDialog = 'meetingFinishedDialog',
    meetingEndDialog = 'meetingEndDialog',
    inviteGuestsDialog = 'inviteGuestsDialog',
    inviteGuestsDialogCountTimeStart = 'inviteGuestsDialogCountTimeStart',
    confirmBecomeParticipantDialog = 'confirmBecomeParticipantDialog',
    confirmBecomeAudienceDialog = 'confirmBecomeAudienceDialog',
    hostDeviceRequireDialog = 'hostDeviceRequireDialog',
    recordVideoDownloadDialog = 'recordVideoDownloadDialog',
    payToAddNewTeamMemberDialog = 'payToAddNewTeamMemberDialog',
    mobilePopUpDialog = 'mobilePopUpDialog',
}

export type DialogActionPayload = {
    dialogKey: AppDialogsEnum;
};

export enum MeetingSoundsEnum {
    NoSound = 'no_sound',
    NewAttendee = 'new_attendee',
}

export type MeetingStore = {
    currentMeeting?: IUserTemplate;
};

export type MeetingNote = {
    content: string;
    user: string;
    id: string;
};

export type MeetingReaction = {
    id: string,
    user: string,
    emojiName: string,
    src: string
}

export enum HttpMethods {
    Post = 'POST',
    Get = 'GET',
    Delete = 'DELETE',
    Put = 'PUT',
    Patch = 'PATCH',
}

export type ApiError = {
    statusCode: number;
    errorJsonObject: unknown;
    error: unknown;
    message: string;
    errorCode: number;
};

export type ApiParams = {
    token?: string;
    ctx?: NextPageContext;
};

export type SuccessResult<Result> = {
    result: Result;
    success: true;
};

export type FailedResult<Error> = {
    success: false;
    result: undefined;
    error?: Error;
    statusCode?: number;
};

export type EntityList<EntityItem> = {
    list: EntityItem[];
    count: number;
};

export enum NotificationType {
    MicAction = 'mic_action',
    CamAction = 'camera_action',
    DevicesAction = 'devices_action',
    LinkInfoCopied = 'link_copied',
    PasswordChanged = 'password_changed',
    PaymentSuccess = 'payment_success',
    PaymentFail = 'password_fail',
    copyNotification = 'text_copied',
    SubscriptionSuccess = 'subscription_success',
    NoTimeLeft = 'no_time_left',
    InviteSent = 'invite_sent',
    HostChanged = 'host_changed',
    SubscriptionEndDate = 'subscription_end_date',
    UploadFileFail = 'upload_file_fail',
    BackgroundFileShouldBeUploaded = 'background_file_should_be_uploaded',
    BackgroundFileIsNotUploadedYet = 'background_file_is_not_uploaded_yet',
    validationError = 'validationError',
    UploadBackgroundSuccess = 'upload_background_success',
    DeleteMedia = 'DeleteMedia',
    RequestBecomeParticipantSuccess = 'request_become_participant_success',
    RequestBecomeAudienceSuccess = 'request_become_audience_success',
    RequestRecordingMeeting = 'request_recording_meeting',
    HostIsAwayForAudiencePaywallPayment = 'host_is_away_for_audience_paywall_payment',
    IsAiTranscriptionTurnedOnByHost = 'is_ai_transcription_turned_on_by_host',
    IsRecordingStarted = 'is_recording_started',
    SendTeamMemberInvitationError = 'send_team_member_invitation_error',
    TeamMemberRemoved = 'team_member_removed',
}

export type Notification = {
    type: NotificationType;
    message: string;
    messageOptions?: { [key: string]: any };
    withSuccessIcon?: boolean;
    withErrorIcon?: boolean;
    withManualClose?: boolean;
};

export type orangeNotification = {
    type: NotificationType;
    message: string;
    messageOptions?: { [key: string]: any };
    withSuccessIcon?: boolean;
    withErrorIcon?: boolean;
    withManualClose?: boolean;
    isIconHand?: boolean;
};

export type PaymentIntentStore = { clientSecret: string; id: string };
export type PaymentExistStore = { isPaywalled: boolean };
export type PaymentIntentParams = {
    paymentType: PaymentType;
};
export enum SocialLinkKeysEnum {
    Youtube = 'youtube',
    Facebook = 'facebook',
    Instagram = 'instagram',
    LinkedIn = 'linkedin',
    Twitter = 'twitter',
    Custom = 'custom',
}

export type UpdateProfileAvatar = {
    file: File;
};

export type SocketState = {
    socketInstance: Socket | null;
};

export type EmitSocketEventPayload = {
    eventName: string;
    data?: unknown;
    socketStore: SocketState;
};

export type EmitSocketEventResponse = {
    success: boolean;
    result?: unknown;
    message?: string;
};

export type UploadTemplateFile = {
    file?: File;
    templateId: string;
    businessCategories: string[];
    previewUrls: string[];
};

export type ContactFormPayload = {
    name: string;
    email: string;
    message: string;
};

export type ContactFormResponse = {
    success: boolean;
    error?: ErrorState | null;
};

export type ProfileTemplatesCountState = StateWithError<ProfileTemplatesCount>;

export interface INextPageContext {
    ctx: NextPageContext;
}

export type GetRoomRatingStatisticParams = {
    basedOn: string;
    roomType: string;
};

export type MeetingRecordVideo = {
    id: string;
    meeting: string;
    user: string;
    endAt: string;
    url: string;
    price: number;
    createdAt: string;
    updatedAt: string;
};

export type RecordingVideo = {
    id?: string;
    meetingName?: string;
    url?: string;
    host?: Profile;
    price?: number;
    endAt?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type MeetingRecording = {
    videos: MeetingRecordVideo[],
    requestUsers?: MeetingUser[],
    isRecordingStarted?: boolean;
    byRequest?: boolean;
    isStartRecordingPending?: boolean;
    isStopRecordingPending?: boolean;
    urlForCopy?: string;
};

export type preEvetnPaymentData = {
    code: string;
    email: string;
};

export * from './state';
export * from './response';
export * from './requestParams';
