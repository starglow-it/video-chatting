import { WebRtcConnection } from '../../helpers/WebRTCConnection';
import { ConnectionType, StreamType } from '../../../../../const/webrtc';
import {
    AnswerExchangePayload,
    ConnectionsStore,
    CreatePeerConnectionsPayload,
    IceCandidatesExchangePayload,
    OfferExchangePayload,
} from '../../types';
import {
    sendAnswerSocketEvent,
    sendIceCandidateSocketEvent,
    sendOfferSocketEvent,
} from '../../sockets/model';
import { getConnectionKey } from '../../helpers/getConnectionKey';
import { setConnectionStream } from '../../model';

export const handleCreateLocalPeerConnections = async ({
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
            senderId,
            userId,
            connectionType,
            streamType,
            stream: options.stream,
            isInitial: false,
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

            return { connectionId, connection };
        } catch (e) {
            await connection.release();
        }
    });

    const data = await Promise.all(connectionPromises);

    return data.reduce(
        (acc, b) =>
            b?.connectionId ? { ...acc, [b.connectionId]: { connection: b.connection } } : acc,
        {},
    );
};
