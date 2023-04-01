import 'webrtc-adapter';
import { ConnectionType, iceServers, StreamType, TrackKind } from '../../const/webrtc';
import {
    AnswerExchangePayload,
    IceCandidatesExchangePayload,
    IWebRtcConnection,
    IWebRtcConnectionData,
    OfferExchangePayload,
} from '../../store/roomStores/videoChat/types';
import { changeTracksState } from './changeTrackState';

export class WebRtcConnection implements IWebRtcConnection {
    connectionType: ConnectionType;

    connectionId: string;

    socketId: string;

    senderId: string;

    userId: string;

    initial: boolean;

    sdpAnswerSet?: boolean;

    sdpAnswer: string | null;

    streamType: StreamType;

    iceServers?: RTCIceServer[];

    peerConnection?: RTCPeerConnection;

    candidateQueue: RTCIceCandidate[];

    stream?: MediaStream | null;

    remoteStream?: MediaStream | null;

    onIceConnectionStateFailed: () => void;

    onIceConnectionStateDisconnected?: (data: { connectionId: string }) => void;

    onDisconnected?: () => void;

    onTrackEnded?: () => void;

    onGotOffer: (args: OfferExchangePayload | AnswerExchangePayload) => void;

    onGotStream: (args: { connectionId: string; type: TrackKind; track: MediaStreamTrack }) => void;

    onGotCandidate: (args: IceCandidatesExchangePayload) => void;

    constructor(data: IWebRtcConnectionData) {
        this.connectionId = data.connectionId;
        this.socketId = data.socketId;
        this.senderId = data.senderId;
        this.connectionType = data.connectionType;
        this.streamType = data.streamType;
        this.userId = data.userId;
        this.iceServers = iceServers;
        console.log('iceServer',iceServers)
        this.stream = data.stream;
        this.initial = data.isInitial ?? false;

        this.onTrackEnded = data.onTrackEnded;
        this.onGotStream = data.onGotStream;
        this.onGotOffer = data.onGotOffer;
        this.onGotCandidate = data.onGotCandidate;
        this.onIceConnectionStateDisconnected = data.onIceConnectionStateDisconnected;
        this.onIceConnectionStateFailed = data.onIceConnectionStateFailed;

        this.candidateQueue = [];
        this.sdpAnswerSet = false;
        this.sdpAnswer = null;
    }

    async createPeerConnection() {
        this.peerConnection = new RTCPeerConnection({
            iceServers: this.iceServers,
        });
        this.peerConnection.onsignalingstatechange = () => {
            if (!this.sdpAnswerSet && this.sdpAnswer) {
                if (this.isPublish()) {
                    this.addAnswer(this.sdpAnswer);
                }
                if (this.isView()) {
                    this.processOffer(this.sdpAnswer);
                }
            }
        };
        this.peerConnection.oniceconnectionstatechange = () => {
            const iceConnectionState = this.peerConnection?.iceConnectionState;

            if (iceConnectionState === 'disconnected') {
                this.onIceConnectionStateDisconnected?.({
                    connectionId: this.connectionId,
                });
            }

            if (iceConnectionState === 'failed') {
                this.onIceConnectionStateFailed();
            }
        };
        this.peerConnection.onicecandidate = e => {
            if (!e.candidate) {
                return;
            }
            this.onGotCandidate({
                type: 'candidate',
                connectionId: this.connectionId,
                candidate: e.candidate,
                userId: this.userId,
                socketId: this.socketId,
                senderId: this.senderId,
            });
        };

        if (!this.isPublish()) {
            this.peerConnection.ontrack = e => {
                this.remoteStream = this.remoteStream || new MediaStream();
                this.remoteStream.addTrack(e.track);
                this.onGotStream({
                    type: e.track.kind as TrackKind,
                    connectionId: this.connectionId,
                    track: e.track,
                });
            };
        } else if (this.stream && this.isScreenSharing()) {
            this.stream.getVideoTracks()[0].onended = () => {
                this.onTrackEnded?.();
            };
        }
    }

    async createOffer() {
        if (!this.peerConnection) {
            return;
        }

        if (this.stream) {
            const videoTrack = this.stream.getVideoTracks()[0];
            const audioTrack = this.stream.getAudioTracks()[0];

            if (audioTrack) this.peerConnection?.addTrack(audioTrack);
            if (videoTrack) this.peerConnection?.addTrack(videoTrack);
        }
        const isPublish = this.isPublish();
        const offer = await this.peerConnection.createOffer({
            offerToReceiveAudio: !isPublish,
            offerToReceiveVideo: !isPublish,
        });
        await this.peerConnection.setLocalDescription(offer);
        console.log('#Duy Phan console', {
            type: 'offer',
            sdp: offer.sdp,
            connectionId: this.connectionId,
            userId: this.userId,
            socketId: this.socketId,
            senderId: this.senderId,
        })
        this.onGotOffer({
            type: 'offer',
            sdp: offer.sdp,
            connectionId: this.connectionId,
            userId: this.userId,
            socketId: this.socketId,
            senderId: this.senderId,
        });
    }

    async processOffer(sdp: string) {
        if (!this.peerConnection || this.sdpAnswerSet) {
            return;
        }
        if (this.peerConnection.signalingState !== 'stable') {
            this.sdpAnswer = sdp;
        }
        const offer = new RTCSessionDescription({ type: 'offer', sdp });
        this.sdpAnswerSet = true;

        if (this.stream) {
            const videoTrack = this.stream.getVideoTracks()[0];
            const audioTrack = this.stream.getAudioTracks()[0];

            if (audioTrack) this.peerConnection?.addTrack(audioTrack);
            if (videoTrack) this.peerConnection?.addTrack(videoTrack);
        }
        await this.peerConnection.setRemoteDescription(offer);

        await Promise.all(this.candidateQueue.map(c => this.addIceCandidate(c)));
        this.candidateQueue = [];

        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.onGotOffer({
            type: 'answer',
            sdp: answer.sdp,
            connectionId: this.connectionId,
            userId: this.userId,
            socketId: this.socketId,
            senderId: this.senderId,
        });
    }

    async addAnswer(sdp: string) {
        if (!this.peerConnection || this.sdpAnswerSet) {
            return;
        }
        if (this.peerConnection.signalingState !== 'have-local-offer') {
            this.sdpAnswer = sdp;
        }
        const answer = new RTCSessionDescription({ type: 'answer', sdp });
        this.sdpAnswerSet = true;
        await this.peerConnection.setRemoteDescription(answer);
        await Promise.all(this.candidateQueue.map(c => this.addIceCandidate(c)));
        this.candidateQueue = [];
    }

    async addIceCandidate(candidate: RTCIceCandidate) {
        if (!this.peerConnection) {
            return;
        }
        if (this.sdpAnswerSet) {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
            this.candidateQueue.push(candidate);
        }
    }

    async release() {
        if (this.peerConnection) {
            await this.peerConnection.close();
            delete this.peerConnection;
        }
    }

    async changeStream(stream: MediaStream) {
        this.peerConnection?.getSenders().forEach(t => {
            if (t?.track?.kind === TrackKind.Audio) {
                const newTrack = stream.getAudioTracks()[0];
                t.replaceTrack(newTrack);
            } else if (t?.track?.kind === TrackKind.Video) {
                const newTrack = stream.getVideoTracks()[0];
                t.replaceTrack(newTrack);
            }
        });
        this.stream = stream;
    }

    applyDeviceSettings(
        devicePermissions: { video?: boolean; audio?: boolean } = { video: false, audio: false },
    ) {
        if (!this.stream || !this.stream.active || this.isScreenSharing()) {
            return;
        }

        changeTracksState({
            enabled: devicePermissions?.audio || false,
            tracks: this.stream.getAudioTracks(),
        });
        changeTracksState({
            enabled: devicePermissions?.video || false,
            tracks: this.stream.getVideoTracks(),
        });
    }

    updateDevicePermissions(devicePermissions: { audio: boolean; video: boolean }) {
        if (this.isScreenSharing()) {
            return;
        }
        this.applyDeviceSettings(devicePermissions);
    }

    async getStats() {
        if (!this.peerConnection || !this.peerConnection.getStats) {
            return null;
        }
        const stats = await this.peerConnection.getStats();
        const result: {
            connectionId: string;
            userId: string;
            streamType: StreamType;
            type: string;
            reports: { [key: string]: string }[];
        } = {
            connectionId: this.connectionId,
            userId: this.userId,
            streamType: this.streamType,
            type: this.connectionType,
            reports: [],
        };
        stats.forEach(report => {
            const reportResult: { [key: string]: string } = {
                type: report.type,
                reportId: report.connectionId,
                timestamp: report.timestamp,
            };
            Object.keys(report)
                .filter(key => !['id', 'timestamp', 'type'].includes(key))
                .forEach(key => {
                    reportResult[key] = report[key];
                });
            result.reports.push(reportResult);
        });
        return result;
    }

    isPublish() {
        return this.connectionType === ConnectionType.PUBLISH;
    }

    isInitial() {
        return this.initial;
    }

    isView() {
        return this.connectionType === ConnectionType.VIEW;
    }

    isVideoChat() {
        return this.streamType === StreamType.VIDEO_CHAT;
    }

    isScreenSharing() {
        return this.streamType === StreamType.SCREEN_SHARING;
    }
}
