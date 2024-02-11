import {
    EmitSocketEventPayload,
    EmitSocketEventResponse,
} from '../../../types';

export const handleEmitSocketEvent = async ({
    eventName,
    data,
    socketStore,
}: EmitSocketEventPayload) => {
    console.log(socketStore, eventName);
    return new Promise((resolve, reject) => {
        socketStore?.socketInstance?.emit(
            eventName,
            data,
            (result: EmitSocketEventResponse) => {
                if (result?.success) {
                    resolve(result?.result);
                } else if (!result?.success) {
                    reject(result?.message);
                } else {
                    reject(result?.message);
                }
            },
        );
    });
}
