import { Socket } from 'socket.io-client';

export type SocketState = {
    socketInstance: Socket | null;
};
