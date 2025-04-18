import { Room } from 'livekit-client';

import { IUserTemplate } from 'shared-types';
import { Meeting, MeetingUser } from '../../types';
import { CustomMediaStream } from '../../../types';
import {
    ConnectionType,
    ServerTypes,
    StreamType,
    TrackKind,
} from '../../../const/webrtc';
import { DeviceInputKindEnum } from '../../../const/media/DEVICE_KINDS';

export type OfferExchangePayload = {
    type: 'offer';
    sdp?: string;
    connectionId: string;
    userId: string;
    socketId: string;
    senderId: string;
};

export type AnswerExchangePayload = {
    type: 'answer';
    sdp?: string;
    connectionId: string;
    userId: string;
    socketId: string;
    senderId: string;
};

export type IceCandidatesExchangePayload = {
    type: 'candidate';
    connectionId: string;
    candidate: RTCIceCandidate;
    userId: string;
    socketId: string;
    senderId: string;
};

export type DevicesExchangePayload = {
    audio: boolean;
    video: boolean;
    userId: MeetingUser['id'];
};

export interface IWebRtcConnectionData {
    connectionType: ConnectionType;
    connectionId: string;
    socketId: string;
    senderId: string;
    userId: string;
    isInitial: boolean;
    onTrackEnded?: () => void;
    onGotOffer: (args: OfferExchangePayload | AnswerExchangePayload) => void;
    onGotStream: (args: {
        connectionId: string;
        type: TrackKind;
        track: MediaStreamTrack;
    }) => void;
    onGotCandidate: (args: IceCandidatesExchangePayload) => void;
    peerConnection?: RTCPeerConnection;
    stream?: MediaStream | null;
    onIceConnectionStateFailed: () => void;
    onIceConnectionStateDisconnected?: (data: { connectionId: string }) => void;
    onDisconnected?: () => void;
    streamType: StreamType;
}

export interface IWebRtcConnection {
    connectionId: string;
    socketId: string;
    senderId: string;
    connectionType: ConnectionType;
    streamType: StreamType;
    userId: string;
    iceServers?: RTCIceServer[];
    stream?: MediaStream | null;
    remoteStream?: MediaStream | null;
    initial: boolean;
    candidateQueue: RTCIceCandidate[];
    peerConnection?: RTCPeerConnection;
    sdpAnswerSet?: boolean | null;
    sdpAnswer?: string | null;
    createPeerConnection: () => void;
    createOffer: () => void;
    processOffer: (sdp: string) => Promise<void>;
    addAnswer: (sdp: string) => Promise<void>;
    addIceCandidate: (candidate: RTCIceCandidate) => void;
    release: () => void;
    changeStream: (stream: MediaStream) => void;
    applyDeviceSettings: (devicePermissions: {
        video: boolean;
        audio: boolean;
    }) => void;
    updateDevicePermissions: (devicePermissions: {
        video: boolean;
        audio: boolean;
    }) => void;
    onGotOffer: (args: OfferExchangePayload | AnswerExchangePayload) => void;
    onGotStream: (args: {
        connectionId: string;
        type: TrackKind;
        track: MediaStreamTrack;
    }) => void;
    onGotCandidate: (args: IceCandidatesExchangePayload) => void;
    onIceConnectionStateFailed: () => void;
    onIceConnectionStateDisconnected?: (data: { connectionId: string }) => void;
    onDisconnected?: () => void;
    getStats: () => unknown;
    isPublish: () => boolean;
    isInitial: () => boolean;
    isView: () => boolean;
    isVideoChat: () => boolean;
    isScreenSharing: () => boolean;
}

export type GetOfferPayload = {
    sdp?: string;
    socketId?: string;
    connection?: IWebRtcConnection;
};

export type GetAnswerPayload = {
    sdp?: string;
    socketId?: string;
    connection?: IWebRtcConnection;
};

export type GetIceCandidatePayload = {
    candidate?: RTCIceCandidate;
    socketId?: string;
    connection?: IWebRtcConnection;
};

export type CreatePeerConnectionsPayload = {
    connectionsData: {
        socketId: MeetingUser['socketId'];
        userId: MeetingUser['id'];
        senderId: MeetingUser['id'];
        connectionType: ConnectionType;
        streamType: StreamType;
        isInitial: boolean;
    }[];
    options?: {
        isAudioEnabled?: boolean;
        isVideoEnabled?: boolean;
        isAuraActive?: boolean;
        stream?: CustomMediaStream;
        onTrackEnded?: () => void;
        onDisconnected?: (data: { connectionId: string }) => void;
    };
};

export type ConnectionsStore = {
    [key: MeetingUser['id']]: {
        connection: IWebRtcConnection;
        stream: CustomMediaStream;
    };
};

export type TrackItem = {
    audioTrack: MediaStreamTrack;
    videoTrack: MediaStreamTrack;
};

export type TracksStore = {
    [key: MeetingUser['id']]: TrackItem;
};

export type RoomStore = Room | null;

export type UseMediaDevices = {
    audioDevices: MediaDeviceInfo[];
    videoDevices: MediaDeviceInfo[];
};

export type SetPermissionsPayload = {
    stream: CustomMediaStream;
    isMicEnabled?: boolean;
    isCamEnabled?: boolean;
    isMicActive: boolean;
    isCameraActive: boolean;
};

export type SetActivePermissionsPayload = {
    userId: MeetingUser['id'];
    stream: CustomMediaStream;
    isMicEnabled?: boolean;
    isCamEnabled?: boolean;
    isMicActive: boolean;
    isCameraActive: boolean;
};

export type ChangeStreamPayload = {
    kind: DeviceInputKindEnum;
    deviceId: MediaDeviceInfo['deviceId'];
    stream: CustomMediaStream;
};

export type InitDevicesPayload = {
    changeStream: CustomMediaStream;
    currentAudioDevice: string;
    currentVideoDevice: string;
    isCameraActive: boolean;
    isMicActive: boolean;
};

export type ToggleDevicePayload = {
    serverType?: ServerTypes;
    isMicEnabled?: boolean;
    isCamEnabled?: boolean;
};

export type GetLiveKitTokenPayload = {
    templateId: IUserTemplate['id'];
    userId: MeetingUser['id'];
};

export type ConnectToSFUPayload = {
    templateId: IUserTemplate['id'];
    userId: MeetingUser['id'];
    serverIp: IUserTemplate['meetingInstance']['serverIp'];
    participantName: MeetingUser['username']
};

export type PublishTracksPayload = {
    stream: CustomMediaStream;
    room: RoomStore;
    isCameraActive: boolean;
    isMicActive: boolean;
    localUser: MeetingUser;
};

export type ChangeTracksPayload = {
    stream: CustomMediaStream;
    room: RoomStore;
    isCameraActive: boolean;
    isMicActive: boolean;
    localUser: MeetingUser;
};

export type StartSFUSharingPayload = {
    room: RoomStore;
    userId: MeetingUser['id'];
};

export type StopSFUSharingPayload = {
    room: RoomStore;
    userId: MeetingUser['id'];
    sharingUserId: Meeting['sharingUserId'];
};

export type ChangeActiveStreamPayload = {
    connections: ConnectionsStore;
    stream: CustomMediaStream;
    isCameraActive: boolean;
    isMicActive: boolean;
};

export type StopRecordingPayload = { 
    id: string, 
    url: string, 
    byRequest?: boolean, 
    meetingId?: string 
};
