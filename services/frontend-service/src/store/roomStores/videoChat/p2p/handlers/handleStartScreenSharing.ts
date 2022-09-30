import { WebRtcConnection } from '../../helpers/WebRTCConnection';
import { ConnectionType, StreamType } from '../../../../../const/webrtc';
import {
    AnswerExchangePayload,
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
import { updateMeetingSocketEvent } from '../../../meeting/sockets/model';
import { setConnectionStream } from '../../model';

export const handleStartScreenSharing = async ({
    connectionsData,
    options,
}: CreatePeerConnectionsPayload) => {
    const connectionsPromise = connectionsData.map(
        async ({ userId, senderId, socketId, isLocal }) => {
            const connectionType = isLocal ? ConnectionType.PUBLISH : ConnectionType.VIEW;
            const streamType = StreamType.SCREEN_SHARING;

            const connectionId = getConnectionKey({
                userId,
                connectionType,
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
                isInitial: isLocal,
                onGotStream: setConnectionStream,
                onTrackEnded: () => {
                    updateMeetingSocketEvent({ sharingUserId: null });
                },
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

                if (isLocal) {
                    await connection.createOffer();
                }

                return connection;
            } catch (e) {
                await connection.release();
            }
        },
    );

    const data = await Promise.all(connectionsPromise);

    return data.reduce(
        (acc, b) => (b?.connectionId ? { ...acc, [b.connectionId]: { connection: b } } : acc),
        {},
    );
};
