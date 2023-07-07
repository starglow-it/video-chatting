import {
    AnswerExchangePayload,
    ConnectionsStore,
    IceCandidatesExchangePayload,
    OfferExchangePayload,
} from '../../types';
import { Meeting, MeetingUser } from '../../../../types';
import { ConnectionType, StreamType } from '../../../../../const/webrtc';
import { getConnectionKey } from '../../../../../helpers/media/getConnectionKey';

export const handleMapConnectionParams = (
    data:
        | OfferExchangePayload
        | AnswerExchangePayload
        | IceCandidatesExchangePayload,
    {
        connections,
        localUser,
        meeting,
    }: {
        connections: ConnectionsStore;
        localUser: MeetingUser;
        meeting: Meeting;
    },
) => {
    const [, streamType] = data.connectionId.split('_');

    const connectionId = getConnectionKey({
        userId: data.senderId,
        connectionType:
            localUser.id === meeting.sharingUserId &&
            streamType === StreamType.SCREEN_SHARING
                ? ConnectionType.PUBLISH
                : ConnectionType.VIEW,
        streamType: streamType as StreamType,
    });

    const targetConnection = connections[connectionId];

    if (data.type === 'candidate') {
        return {
            candidate: data.candidate,
            connection: targetConnection?.connection,
        };
    }

    return {
        sdp: data.sdp,
        connection: targetConnection?.connection,
    };
};
