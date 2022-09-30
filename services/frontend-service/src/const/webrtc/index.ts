import frontendConfig from '../config';

export enum ConnectionType {
    VIEW = 'view',
    PUBLISH = 'publish',
}

export enum TrackKind {
    Audio = 'audio',
    Video = 'video',
}

export enum StreamType {
    VIDEO_CHAT = 'video.chat',
    SCREEN_SHARING = 'screen.sharing',
}

export enum ServerTypes {
    P2P = 'p2p',
    SFU = 'sfu',
}

export const iceServers: RTCIceServer[] = [
    {
        urls: 'stun:stun.l.google.com:19302',
    },
    {
        urls: [
            `turn:${frontendConfig.turnUrl}:${frontendConfig.turnPort}?transport=tcp`,
            `turn:${frontendConfig.turnUrl}:${frontendConfig.turnPort}?transport=udp`,
        ],
        username: frontendConfig.turnUserName,
        credential: frontendConfig.turnPassword,
    },
];
