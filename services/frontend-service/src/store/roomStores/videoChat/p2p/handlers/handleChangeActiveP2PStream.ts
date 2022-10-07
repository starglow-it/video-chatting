import { ChangeActiveStreamPayload } from '../../types';

export const handleChangeActiveP2PStream = async ({
    connections,
    stream,
    isCameraActive,
    isMicActive,
}: ChangeActiveStreamPayload): Promise<void> => {
    const changeStreamPromises = Object.entries(connections).map(async ([, connection]) => {
        await connection.connection.changeStream(stream as MediaStream);
        connection.connection.updateDevicePermissions({
            video: isCameraActive,
            audio: isMicActive,
        });
    });

    await Promise.all(changeStreamPromises);
};
