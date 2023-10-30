import { io } from 'socket.io-client';
import { IUserTemplate } from 'shared-types';
import frontendConfig from '../../../../const/config';
import { getMeetingInstanceSocketUrl } from '../../../../utils/functions/getMeetingInstanceSocketUrl';
import { sendReconnectMeetingSocketEvent } from '../../meeting/sockets/init';

export const handleConnectSocket = async ({
    serverIp,
}: {
    serverIp: IUserTemplate['meetingInstance']['serverIp'];
}) => {
    const socketUrl =
        !['localhost', frontendConfig.defaultServerIp].includes(serverIp) &&
        serverIp
            ? getMeetingInstanceSocketUrl(serverIp)
            : 'ws://192.168.110.65:8081';
    console.log('#Duy Phan console', socketUrl)
    const socketInstance = io(socketUrl, {
        transports: ['websocket'],
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
