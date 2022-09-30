import { RoomStore } from '../../types';

export const handleDisconnectFromSFU = async ({ room }: { room: RoomStore }) => {
    if (room) {
        console.log('handleDisconnectFromSFU');
        await room.disconnect();
    }
};
