import { ConnectionType, StreamType } from '../../../../const/webrtc';

export const getConnectionKey = ({
    userId,
    streamType,
    connectionType,
}: {
    userId: string;
    streamType: StreamType;
    connectionType: ConnectionType;
}) => `${userId}_${streamType}_${connectionType}`;
