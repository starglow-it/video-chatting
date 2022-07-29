import { EmitSocketEventPayload } from '../../types';

export const handleEmitSocketEvent = async ({
    eventName,
    data,
    socketStore,
}: EmitSocketEventPayload) => {
    return new Promise((resolve, reject) => {
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
};
