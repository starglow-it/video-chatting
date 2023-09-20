import { io } from 'socket.io-client';
import { IUserTemplate } from 'shared-types';
import frontendConfig from '../../../../const/config';
import { getMeetingInstanceSocketUrl } from '../../../../utils/functions/getMeetingInstanceSocketUrl';
import { sendReconnectMeetingSocketEvent } from '../../meeting/sockets/init';

let isFirstime = true;

export const handleConnectSocket = async ({
    serverIp,
}: {
    serverIp: IUserTemplate['meetingInstance']['serverIp'];
}) => {
    const socketUrl =
        !['localhost', frontendConfig.defaultServerIp].includes(serverIp) &&
        serverIp
            ? getMeetingInstanceSocketUrl(serverIp)
            : frontendConfig.meetingSocketUrl;

    const socketInstance = io(socketUrl, {
        transports: ['websocket'],
    });

    const connectPromise = new Promise((resolve, reject) => {
        socketInstance.on('connect', async () => {
            console.log('meeting socket connected', isFirstime);
            if (!isFirstime) {
                sendReconnectMeetingSocketEvent();
            }
            resolve(true);
        });

        socketInstance.on('connect_error', async err => {
            console.log('meeting socket connect error', err);
            reject(err);
        });

        socketInstance.on('error', async err => {
            console.log('meeting socket error', err);
            reject(err);
        });

        socketInstance.on('disconnect', async () => {
            console.log('meeting socket disconnect');
            isFirstime = false;
            resolve(true);
        });
    });

    await connectPromise;

    return {
        socketInstance,
    };
};
