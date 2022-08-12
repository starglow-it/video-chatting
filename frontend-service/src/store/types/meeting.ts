import {
    IAgoraRTCRemoteUser,
    ILocalAudioTrack,
    ILocalVideoTrack,
    IRemoteAudioTrack,
    IRemoteVideoTrack,
} from 'agora-rtc-sdk-ng';
import { Profile, Template } from '.';

export type Meeting = {
    id: string;
    isMonetizationEnabled?: boolean;
    sharingUserId?: number;
    endsAt?: number;
    startAt?: number;
    mode: string;
    owner: MeetingUser['id'];
    ownerProfileId: MeetingUser['profileId'];
    users: MeetingUser[];
};

export type MeetingInstance = {
    id: string;
    serverIp: string;
    owner: string;
};

export enum MeetingAccessStatuses {
    EnterName = 'enterName',
    Settings = 'settings',
    Waiting = 'waiting',
    RequestSent = 'requestSent',
    InMeeting = 'inMeeting',
    Rejected = 'rejected',
    Kicked = 'Kicked',
}

export enum MeetingSoundsEnum {
    NoSound = 'no_sound',
    NewAttendee = 'new_attendee',
}

export type MeetingUser = {
    id: string;
    profileId: string;
    socketId: string;
    username: string;
    accessStatus: MeetingAccessStatuses;
    cameraStatus: string;
    micStatus: string;
    profileAvatar: string;
    isGenerated: boolean;
    isAuraActive: boolean;
    meeting: Meeting['id'];
    meetingUserId?: IAgoraRTCRemoteUser['uid'];
    media?: IAgoraRTCRemoteUser;
    audioTrack?: ILocalAudioTrack | IRemoteAudioTrack;
    videoTrack?: ILocalVideoTrack | IRemoteVideoTrack;
    userPosition?: {
        bottom: number;
        left: number;
    };
};

export type UpdateTemplateData = {
    templateId: Template['id'];
    userId: Profile['id'];
    data: any;
};

export type MeetingStore = {
    currentMeeting?: any;
};

export type MeetingNote = {
    content: string;
    user: string;
    id: string;
};
