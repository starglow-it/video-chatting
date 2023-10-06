import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TEventEmitter } from '../types/socket-events';

export class BaseGateway {
  @WebSocketServer() server: Server;

  emitToSocketId(...[socketId, eventName, data]: TEventEmitter) {
    this.server.to(socketId).emit(eventName, data ?? {});
  }

  emitToRoom(...[roomId, eventName, data]: TEventEmitter) {
    this.server.sockets.in(roomId).emit(eventName, data ?? {});
  }

  broadcastToRoom(socket: Socket, ...[roomId, eventName, data]: TEventEmitter) {
    socket.broadcast.to(roomId).emit(eventName, data ?? {});
  }

  async getSocket(roomId, socketId) {
    const sockets = await this.server.sockets.in(roomId).fetchSockets();

    return sockets.find((socket) => socket.id === socketId);
  }
}
