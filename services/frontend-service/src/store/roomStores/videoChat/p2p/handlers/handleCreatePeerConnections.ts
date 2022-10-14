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
import { setConnectionStream } from '../../model';
import { WebRtcConnection } from '../../../../../helpers/media/WebRTCConnection';
import { getConnectionKey } from '../../../../../helpers/media/getConnectionKey';

export const handleCreatePeerConnections = async ({
    connectionsData,
    options,
}: CreatePeerConnectionsPayload): Promise<ConnectionsStore> => {
    const connectionPromises = connectionsData.map(
        async ({ connectionType, streamType, isInitial, userId, senderId, socketId }) => {
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
                stream: options?.stream,
                isInitial,
                onGotStream: setConnectionStream,
                onTrackEnded: options?.onTrackEnded,
                onIceConnectionStateDisconnected: options?.onDisconnected,
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
                onIceConnectionStateFailed: () => {},
            });

            try {
                await connection.createPeerConnection();

                if (connection.isInitial()) {
                    await connection.createOffer();
                }

                if (connection.isPublish() && connection.isVideoChat()) {
                    await connection.applyDeviceSettings({
                        audio: options?.isAudioEnabled,
                        video: options?.isVideoEnabled,
                    });
                }

                return connection;
            } catch (e) {
                await connection.release();
            }
        },
    );

    const data = await Promise.all(connectionPromises);

    return data.reduce(
        (acc, b) => (b?.connectionId ? { ...acc, [b.connectionId]: { connection: b } } : acc),
        {},
    );
};
