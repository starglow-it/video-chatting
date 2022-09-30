import { io } from 'socket.io-client';

export const handleConnectSocket = async () => {
    const socketInstance = io({ transports: ['websocket'] });

    const connectPromise = new Promise((resolve, reject) => {
        socketInstance.on('connect', async () => {
            resolve(true);
        });

        socketInstance.on('connect_error', async err => {
            reject(err);
        });
    });

    await connectPromise;

    return {
        socketInstance,
    };
};
