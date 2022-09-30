import { ConnectionsStore } from '../../types';
import { CustomMediaStream } from '../../../../../types';

export const handleChangeActiveP2PStream = async ({
    connections,
    stream,
    isCameraActive,
    isMicActive,
}: {
    connections: ConnectionsStore;
    stream: CustomMediaStream;
    isCameraActive: boolean;
    isMicActive: boolean;
}) => {
    const changeStreamPromises = Object.entries(connections).map(async ([, connection]) => {
        await connection.connection.changeStream(stream as MediaStream);
        connection.connection.updateDevicePermissions({
            video: isCameraActive,
            audio: isMicActive,
        });
    });

    return Promise.all(changeStreamPromises);
};
