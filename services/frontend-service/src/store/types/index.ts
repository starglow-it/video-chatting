import { Socket } from 'socket.io-client';
import {
    ErrorState,
    IBusinessCategory,
    ICommonTemplate,
    ILanguage,
    IPreviewImage,
    IProfileAvatar,
    ISocialLink,
    MeetingAccessStatusEnum,
    ProfileTemplatesCount,
    StateWithError,
    TokenPair,
    PlanKeys,
} from 'shared-types';
import { NextPageContext } from 'next';

export interface Template {
    id: string;
    usedAt: string;
    templateId: number;
    url: string;
    draftUrl?: string;
    name: string;
    description: string;
    shortDescription: string;
    type: string;
    companyName: string;
    contactEmail: string;
    fullName: string;
    position: string;
    customLink: string;
    maxParticipants: number;
    priceInCents: number;
    isAudioAvailable: boolean;
    isPublic?: boolean;
    usersPosition: { bottom: number; left: number }[];
    links?: { id: string; item: string; position: { top: number; left: number } }[];
    businessCategories: IBusinessCategory[];
    previewUrls: IPreviewImage[];
    draftPreviewUrls?: IPreviewImage[];
    languages: ILanguage[];
    socials: ISocialLink[];
    author?: string;
    templateType: 'video' | 'image';
}

export type Profile = {
    id: string;
    fullName: string;
    position: string;
    profileAvatar: IProfileAvatar;
    companyName: string;
    email: string;
    country: string;
    contactEmail: string;
    signBoard: string;
    stripeAccountId: string;
    stripeEmail: string;
    stripeSubscriptionId: string;
    subscriptionPlanKey: PlanKeys;
    previousSubscriptionPlanKey: PlanKeys;
    isSubscriptionActive: boolean;
    isStripeEnabled: boolean;
    wasSuccessNotificationShown: boolean;
    description: string;
    maxTemplatesNumber: number;
    renewSubscriptionTimestampInSeconds: number;
    maxMeetingTime: number;
    socials: ISocialLink[];
    languages: ILanguage[];
    businessCategories: IBusinessCategory[];
    isProfessionalTrialAvailable: boolean;
    shouldShowTrialExpiredNotification: boolean;
    isDowngradeMessageShown: boolean;
};

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
};

export interface UserTemplate extends Template {
    signBoard: string;
    isMonetizationEnabled: boolean;
    templatePrice: number;
    templateCurrency: 'USD' | 'CAD';
    meetingInstance: {
        id: string;
        serverIp: string;
        owner: Profile['id'];
        serverStatus: string;
    };
    user?: {
        profileAvatar: IProfileAvatar;
    };
}

export type AuthUserState = {
    isAuthenticated: boolean;
    error?: ErrorState | null;
    user?: Profile;
};

export type LoginUserParams = {
    email: string;
    password: string;
};

export type RegisteredUserState = {
    isUserRegistered?: boolean;
    isUserConfirmed?: boolean;
    error?: ErrorState | null;
};

export type RegisterUserParams = {
    email: string;
    password: string;
    templateId: ICommonTemplate['id'];
};

export type LoginUserResponse = { user: Profile } & TokenPair;
export type LoginUserPayload = { email: string; password: string };

export type JoinMeetingResult = { user?: MeetingUser; meeting?: Meeting; users?: MeetingUser[] };

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
    template: UserTemplate;
    notificationType: DashboardNotificationTypes;
    sender: DashboardNotificationUser;
    senderFullName: string;
    sentAt: number;
    status: DashboardNotificationReadStatus;
};

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
    emailResetPasswordDialog: boolean;
    deleteProfileDialog: boolean;
    replaceTemplateConfirmDialog: boolean;
    timeExpiredDialog: boolean;
    hostTimeExpiredDialog: boolean;
    confirmCancelRoomCreationDialog: boolean;
    userBlockedDialog: boolean;
    hostUserDeletedDialog: boolean;
    downgradedSubscriptionDialog: boolean;
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
    emailResetPasswordDialog = 'emailResetPasswordDialog',
    deleteProfileDialog = 'deleteProfileDialog',
    replaceTemplateConfirmDialog = 'replaceTemplateConfirmDialog',
    timeExpiredDialog = 'timeExpiredDialog',
    confirmCancelRoomCreationDialog = 'confirmCancelRoomCreationDialog',
    hostTimeExpiredDialog = 'hostTimeExpiredDialog',
    hostUserDeletedDialog = 'hostUserDeletedDialog',
    userBlockedDialog = 'userBlockedDialog',
    downgradedSubscriptionDialog = 'downgradedSubscriptionDialog',
}

export type DialogActionPayload = {
    dialogKey: AppDialogsEnum;
};

export enum MeetingSoundsEnum {
    NoSound = 'no_sound',
    NewAttendee = 'new_attendee',
}

export type MeetingStore = {
    currentMeeting?: UserTemplate;
};

export type MeetingNote = {
    content: string;
    user: string;
    id: string;
};

export enum HttpMethods {
    Post = 'POST',
    Get = 'GET',
    Delete = 'DELETE',
    Put = 'PUT',
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
}

export type Notification = {
    type: NotificationType;
    message: string;
    messageOptions?: { [key: string]: any };
    withSuccessIcon?: boolean;
    withErrorIcon?: boolean;
    withManualClose?: boolean;
};

export type PaymentIntentStore = { clientSecret: string; id: string };

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
