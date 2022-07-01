import { Socket } from 'socket.io-client';

export type SocketState = {
    socketInstance: Socket | null;
};

export type EmitSocketEventPayload = {
    eventName: string;
    data?: unknown;
    socketStore: SocketState
}