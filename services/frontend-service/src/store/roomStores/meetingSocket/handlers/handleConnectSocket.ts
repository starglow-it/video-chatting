import { io } from 'socket.io-client';
import frontendConfig from '../../../../const/config';
import { getMeetingInstanceSocketUrl } from '../../../../utils/functions/getMeetingInstanceSocketUrl';
import {IUserTemplate} from "shared-types";

export const handleConnectSocket = async ({
    serverIp,
}: {
    serverIp: IUserTemplate['meetingInstance']['serverIp'];
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
