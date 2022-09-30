import { WebRtcConnection } from '../../helpers/WebRTCConnection';
import { ConnectionType, StreamType } from '../../../../../const/webrtc';
import {
    sendAnswerSocketEvent,
    sendIceCandidateSocketEvent,
    sendOfferSocketEvent,
} from '../../sockets/model';
import {
    AnswerExchangePayload,
    ConnectionsStore,
    CreatePeerConnectionsPayload,
    IceCandidatesExchangePayload,
    OfferExchangePayload,
} from '../../types';
import { getConnectionKey } from '../../helpers/getConnectionKey';
import { setConnectionStream } from '../../model';

export const handleCreatePeerConnections = async ({
    connectionsData,
    options,
}: CreatePeerConnectionsPayload): Promise<ConnectionsStore> => {
    const connectionPromises = connectionsData.map(async ({ userId, senderId, socketId }) => {
        const connectionType = ConnectionType.VIEW;
        const streamType = StreamType.VIDEO_CHAT;

        const connectionId = getConnectionKey({
            connectionType,
            userId,
            streamType,
        });

        const connection = new WebRtcConnection({
            connectionId,
            socketId,
            userId,
            senderId,
            connectionType,
            streamType,
            stream: options.stream,
            isInitial: true,
            onGotStream: setConnectionStream,
            onGotOffer: (data: OfferExchangePayload | AnswerExchangePayload) => {
                if (data.type === 'offer') {
                    sendOfferSocketEvent(data);
                }
                if (data.type === 'answer') {
                    sendAnswerSocketEvent(data);
                }
            },
            onGotCandidate: (data: IceCandidatesExchangePayload) => {
                sendIceCandidateSocketEvent(data);
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onIceConnectionStateDisconnected: () => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onIceConnectionStateFailed: () => {},
        });

        try {
            await connection.createPeerConnection();

            await connection.createOffer();

            if (connection.isPublish() && connection.isVideoChat()) {
                await connection.applyDeviceSettings({
                    audio: options.isAudioEnabled,
                    video: options.isVideoEnabled,
                });
            }

            return { connectionId, connection };
        } catch (e) {
            // this.p2p[connection.connectionId].release();
        }
    });

    const data = await Promise.all(connectionPromises);

    return data.reduce(
        (acc, b) =>
            b?.connectionId ? { ...acc, [b.connectionId]: { connection: b.connection } } : acc,
        {},
    );
};
