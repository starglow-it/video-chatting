import { io } from 'socket.io-client';
import { IUserTemplate } from 'shared-types';
import frontendConfig from '../../../../const/config';
import { getMeetingInstanceSocketUrl } from '../../../../utils/functions/getMeetingInstanceSocketUrl';
import { sendReconnectMeetingSocketEvent } from '../../meeting/sockets/init';

export const handleConnectSocket = async ({
    serverIp = frontendConfig.defaultServerIp,
    isStatistics = false
}: {
    serverIp: IUserTemplate['meetingInstance']['serverIp'];
    isStatistics?: boolean
}) => {
    console.log(serverIp)
    console.log(frontendConfig)
    console.log('[[[[[[[[[[[[[[serverIp]]]]]]]]]]]]]]')
    const socketUrl =
        !['localhost', frontendConfig.defaultServerIp].includes(serverIp) &&
            serverIp
            ? getMeetingInstanceSocketUrl(serverIp)
            : frontendConfig.meetingSocketUrl;

    const socketInstance = !isStatistics ?
        io(socketUrl, {
            transports: ['websocket'],
        })
        : io(socketUrl, {
            transports: ['websocket'],
            query: {
                isStatistics: true
            }
        });

    let isDisconnect = false;

    const connectPromise = new Promise((resolve, reject) => {
        socketInstance.on('connect', async () => {
            console.log('meeting socket connected', isDisconnect);
            if (isDisconnect) {
                console.log('meeting socket connected', 'reload');
                isDisconnect = false;
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
            isDisconnect = true;
            console.log('meeting socket disconnect');
            resolve(true);
        });
    });

    await connectPromise;

    return {
        socketInstance,
    };
};
