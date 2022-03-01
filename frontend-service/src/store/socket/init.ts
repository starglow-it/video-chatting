import { attach } from 'effector-next';
import { io } from 'socket.io-client';
import {
    $socketStore,
    disconnectSocketEvent,
    initiateSocketConnectionFx,
    resetSocketStore,
    socketEventRequest,
} from './model';

socketEventRequest.use(async ({ eventName, data, socketStore }) => {
    const socketPromise = new Promise((resolve, reject) => {
        socketStore?.socketInstance?.emit(eventName, data, (result: any) => {
            if (result?.success) {
                resolve(result?.result);
            } else if (!result?.success) {
                reject(result?.message);
            } else {
                reject(false);
            }
        });
    });

    return await socketPromise;
});

initiateSocketConnectionFx.use(async () => {
    const socketInstance = io({
        transports: ['websocket'],
    });

    const connectPromise = new Promise((resolve, reject) => {
        socketInstance.on('connect', async () => {
            resolve(true);
        });

        socketInstance.on('connect_error', async () => {
            reject(false);
        });
    });

    await connectPromise;

    return {
        socketInstance,
    };
});

const socketEventFx = attach({
    effect: socketEventRequest,
    source: $socketStore,
    mapParams: ({ data, eventName }, socketStore) => ({ eventName, data, socketStore }),
});

export const createSocketEvent = (eventName: string) =>
    attach({
        effect: socketEventFx,
        mapParams: data => ({ eventName, data }),
    });

$socketStore
    .on(initiateSocketConnectionFx.doneData, (state, data) => ({
        socketInstance: data.socketInstance,
    }))
    .on(disconnectSocketEvent, state => {
        state.socketInstance?.disconnect();
        return {
            socketInstance: null,
        };
    })
    .on(resetSocketStore, state => {
        state.socketInstance?.disconnect();
    });
