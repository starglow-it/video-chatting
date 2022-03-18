import { attach } from 'effector-next';
import { io } from 'socket.io-client';
import {
    $mainSocketStore,
    disconnectMainSocketEvent,
    initiateMainSocketConnectionFx,
    resetMainSocketStore,
    mainSocketEventRequest,
} from './model';

mainSocketEventRequest.use(async ({ eventName, data, socketStore }) => {
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

initiateMainSocketConnectionFx.use(async () => {
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

const mainSocketEventFx = attach({
    effect: mainSocketEventRequest,
    source: $mainSocketStore,
    mapParams: ({ data, eventName }, socketStore) => ({ eventName, data, socketStore }),
});

export const createMainSocketEvent = (eventName: string) =>
    attach({
        effect: mainSocketEventFx,
        mapParams: data => ({ eventName, data }),
    });

$mainSocketStore
    .on(initiateMainSocketConnectionFx.doneData, (state, data) => ({
        socketInstance: data.socketInstance,
    }))
    .on(disconnectMainSocketEvent, state => {
        state.socketInstance?.disconnect();
        return {
            socketInstance: null,
        };
    })
    .on(resetMainSocketStore, state => {
        state.socketInstance?.disconnect();
    });
