import { io } from 'socket.io-client';
import frontendConfig from '../../../../const/config';
import { UserTemplate } from '../../../types';
import { getMeetingInstanceSocketUrl } from '../../../../utils/functions/getMeetingInstanceSocketUrl';

export const handleConnectSocket = async ({
    serverIp,
}: {
    serverIp: UserTemplate['meetingInstance']['serverIp'];
}) => {
    const socketUrl =
        !['localhost', frontendConfig.defaultServerIp].includes(serverIp) && serverIp
            ? getMeetingInstanceSocketUrl(serverIp)
            : frontendConfig.meetingSocketUrl;

    const socketInstance = io(socketUrl, {
        transports: ['websocket'],
    });

    const connectPromise = new Promise((resolve, reject) => {
        socketInstance.on('connect', async () => {
            resolve(true);
        });

        socketInstance.on('connect_error', async err => {
            reject(err);
        });

        socketInstance.on('error', async err => {
            reject(err);
        });
    });

    await connectPromise;

    return {
        socketInstance,
    };
};
