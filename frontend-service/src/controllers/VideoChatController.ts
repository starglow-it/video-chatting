import AgoraRTC, {
    CustomAudioTrackInitConfig,
    CustomVideoTrackInitConfig,
    IAgoraRTCClient,
    IAgoraRTCRemoteUser,
    ILocalAudioTrack,
    ILocalVideoTrack,
} from 'agora-rtc-sdk-ng';
import getConfig from 'next/config';
import { sendRequest } from '../helpers/http/sendRequest';
import { generateAgoraTokenUrl } from '../utils/urls';
import { AUDIO_UNMUTE, TRACKS_INFO, VIDEO_UNMUTE } from '../const/media/agora/UPDATE_INFO_TYPES';
import { updateUserTracksEvent } from '../store/users';

const { publicRuntimeConfig } = getConfig();

export class VideoChatController {
    readonly client: IAgoraRTCClient;
    private channel?: string;
    private uid?: IAgoraRTCRemoteUser['uid'];
    private isPublisher: boolean;
    private localMicTrack?: ILocalAudioTrack;
    private localCameraTrack?: ILocalVideoTrack;
    private screenSharingTrack?: ILocalVideoTrack;
    private onUserPublished?: (user: IAgoraRTCRemoteUser) => void;
    private onUserUnPublished?: (user: IAgoraRTCRemoteUser) => void;
    private onUserJoined?: (user: IAgoraRTCRemoteUser) => void;
    private onSharingStarted?: (data: { sharingUserId: IAgoraRTCRemoteUser['uid'] | null }) => void;
    private onSharingStopped?: (data: { sharingUserId: IAgoraRTCRemoteUser['uid'] | null }) => void;
    private userLeft?: (user: IAgoraRTCRemoteUser) => void;
    private onLocalTracks?: (data: {
        audioTrack: ILocalAudioTrack;
        videoTrack: ILocalVideoTrack;
    }) => void;

    constructor(private appId: string) {
        this.isPublisher = false;
        AgoraRTC.setLogLevel(4);
        this.client = AgoraRTC.createClient({
            codec: 'vp8',
            mode: 'rtc',
            turnServer: {
                turnServerURL: publicRuntimeConfig.turnUrl,
                password: publicRuntimeConfig.turnPassword,
                udpport: publicRuntimeConfig.turnPort,
                username: publicRuntimeConfig.turnUserName,
                forceturn: true,
                tcpport: publicRuntimeConfig.turnPort,
                security: true,
            },
        });
    }

    setUpController({
        channel,
        uid,
        onUserPublished,
        onUserUnPublished,
        onUserJoined,
        userLeft,
        onLocalTracks,
        onSharingStarted,
        onSharingStopped,
    }: {
        channel: string;
        uid: IAgoraRTCRemoteUser['uid'];
        onUserPublished: (user: IAgoraRTCRemoteUser) => void;
        onUserUnPublished: (user: IAgoraRTCRemoteUser) => void;
        onUserJoined: (user: IAgoraRTCRemoteUser) => void;
        userLeft: (user: IAgoraRTCRemoteUser) => void;
        onSharingStarted: (data: { sharingUserId: IAgoraRTCRemoteUser['uid'] | null }) => void;
        onSharingStopped: (data: { sharingUserId: IAgoraRTCRemoteUser['uid'] | null }) => void;
        onLocalTracks: (data: {
            audioTrack: ILocalAudioTrack;
            videoTrack: ILocalVideoTrack;
        }) => void;
    }) {
        this.channel = channel;
        this.onUserPublished = onUserPublished;
        this.onUserUnPublished = onUserUnPublished;
        this.onUserJoined = onUserJoined;
        this.userLeft = userLeft;
        this.onLocalTracks = onLocalTracks;
        this.onSharingStarted = onSharingStarted;
        this.onSharingStopped = onSharingStopped;
        this.isPublisher = false;

        this.uid = uid;
    }

    getAgoraAccessToken = async (): Promise<string | undefined> => {
        if (!this.channel) return;

        const response = await sendRequest<{ token: string }, any>(
            generateAgoraTokenUrl(this.channel, this.uid as number, this.isPublisher)
        );

        return response.result?.token!;
    };

    async initiateConnection({ stream }: { stream?: MediaStream | null }) {
        if (!this.channel || !this.uid || !this.client) return;

        this.isPublisher = Boolean(stream?.id);

        const token = (await this.getAgoraAccessToken()) as string;

        if (stream) {
            await this.createLocalTracks(stream);
        }

        await this.client.join(this.appId, this.channel, token, this.uid);

        if (this.localMicTrack && this.localCameraTrack) {
            await this.client.publish([this.localMicTrack, this.localCameraTrack]);
        }

        this.subscribeToEvents();

        if (this.client?.remoteUsers?.length) {
            const subscribePromise = this.client.remoteUsers.map(async remoteUser => {
                await this.client?.subscribe(remoteUser, 'audio');
                await this.client?.subscribe(remoteUser, 'video');

                updateUserTracksEvent({ userUid: remoteUser.uid, infoType: AUDIO_UNMUTE });
                updateUserTracksEvent({ userUid: remoteUser.uid, infoType: VIDEO_UNMUTE });

                this.onUserPublished?.(remoteUser);
            });

            await Promise.all(subscribePromise);
        }
    }

    async createLocalTracks(stream: MediaStream): Promise<void> {
        const videoTrack = stream?.getVideoTracks()[0];
        const audioTrack = stream?.getAudioTracks()[0];

        const videoConfig = {
            mediaStreamTrack: videoTrack,
        } as CustomVideoTrackInitConfig;

        const audioConfig = {
            mediaStreamTrack: audioTrack,
        } as CustomAudioTrackInitConfig;

        this.localCameraTrack = await AgoraRTC.createCustomVideoTrack(videoConfig);

        this.localMicTrack = await AgoraRTC.createCustomAudioTrack(audioConfig);

        if (this.localMicTrack && this.localCameraTrack) {
            this.onLocalTracks?.({
                audioTrack: this.localMicTrack,
                videoTrack: this.localCameraTrack,
            });
        }
    }

    leave() {
        this.localMicTrack?.stop?.();
        this.localMicTrack?.close?.();
        this.localCameraTrack?.stop?.();
        this.localCameraTrack?.close?.();

        this.client?.leave();
    }

    subscribeToEvents() {
        if (this.client) {
            this.client.on(
                'user-published',
                async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
                    try {
                        if (mediaType === 'audio') {
                            await this.client?.subscribe(user, 'audio');
                            updateUserTracksEvent({ userUid: user.uid, infoType: AUDIO_UNMUTE });
                        } else if (mediaType === 'video') {
                            await this.client?.subscribe(user, 'video');
                            updateUserTracksEvent({ userUid: user.uid, infoType: VIDEO_UNMUTE });
                        }
                    } catch (err) {
                        console.log(err);
                    } finally {
                        this.onUserPublished?.(user);
                    }
                },
            );

            this.client.on('user-unpublished', (user: IAgoraRTCRemoteUser) => {
                // this.onUserUnPublished?.(user);
            });

            this.client.on('user-info-updated', (user: number, infoType) => {
                if (TRACKS_INFO.includes(infoType)) {
                    updateUserTracksEvent({ userUid: user, infoType });
                }
            });

            this.client.on('user-joined', async (user: IAgoraRTCRemoteUser) => {
                this.onUserPublished?.(user);
            });

            this.client.on('user-left', this.userLeft!);

            this.client.on('token-privilege-will-expire', async () => {
                const token = (await this.getAgoraAccessToken()) as string;
                await this.client?.renewToken(token);
            });

            this.client.on('token-privilege-did-expire', async () => {
                const token = await this.getAgoraAccessToken?.();
                await this.client?.join(this.appId, this.channel!, token!, this.uid);
            });
        }
    }

    async setUpDevices(stream: MediaStream) {
        try {
            this.localMicTrack?.stop?.();
            this.localMicTrack?.close?.();
            this.localCameraTrack?.stop?.();
            this.localCameraTrack?.close?.();

            if (this.localCameraTrack && this.localMicTrack) {
                this.client?.unpublish([this.localCameraTrack, this.localMicTrack]);
            }

            await this.createLocalTracks(stream);

            if (this.localMicTrack && this.localCameraTrack) {
                await this.client?.publish([this.localMicTrack, this.localCameraTrack]);
            }
        } catch (e) {
            console.log(e);
        }
    }

    setTracksState({
        isCameraEnabled,
        isMicEnabled,
    }: {
        isCameraEnabled: boolean;
        isMicEnabled: boolean;
    }) {
        this.localCameraTrack?.setMuted(!isCameraEnabled);
        this.localMicTrack?.setMuted(!isMicEnabled);
    }

    async startScreensharing() {
        try {
            this.screenSharingTrack = await AgoraRTC.createScreenVideoTrack(
                {
                    encoderConfig: {
                        frameRate: 30,
                        height: 720,
                        width: 1280,
                    },
                },
                'disable',
            );

            this.screenSharingTrack.on('track-ended', () => {
                this.onSharingStarted?.({ sharingUserId: null });
            });

            await this.client.unpublish(this.localCameraTrack);
            this.localCameraTrack?.stop?.();
            this.localCameraTrack?.close?.();

            this.client?.publish(this.screenSharingTrack);

            if (this.localMicTrack) {
                this.onLocalTracks?.({
                    audioTrack: this.localMicTrack,
                    videoTrack: this.screenSharingTrack,
                });
            }
            if (this.uid) this.onSharingStarted?.({ sharingUserId: this.uid });
        } catch (err: unknown) {
            console.log(err);
        }
    }

    async stopScreensharing({ stream }: { stream: MediaStream }) {
        try {
            await this.client.unpublish(this.screenSharingTrack);

            this.screenSharingTrack?.stop?.();
            this.screenSharingTrack?.close?.();

            const videoTrack = stream?.getVideoTracks()[0];

            const config = {
                mediaStreamTrack: videoTrack,
            } as CustomVideoTrackInitConfig;

            this.localCameraTrack = await AgoraRTC.createCustomVideoTrack(config);

            if (this.localCameraTrack) {
                this.client?.publish(this.localCameraTrack);
            }

            if (this.localMicTrack && this.localCameraTrack) {
                this.onLocalTracks?.({
                    audioTrack: this.localMicTrack,
                    videoTrack: this.localCameraTrack,
                });
            }
            if (this.uid) this.onSharingStarted?.({ sharingUserId: null });
        } catch (err: unknown) {
            console.log(err);
        }
    }
}

export const AgoraController = new VideoChatController('9d88cb47f5e648c1b2b3c6ee8563e655');
