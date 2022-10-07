import { RoomStore } from '../../types';

export const handleDisconnectFromSFU = async ({ room }: { room: RoomStore }) => {
    if (room) {
        await room.disconnect();
    }
};
