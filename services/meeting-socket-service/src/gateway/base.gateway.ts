import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EventEmit } from 'src/types/socket-events';

export class BaseGateway {
  @WebSocketServer() server: Server;

  emitToSocketId(...[socketId, eventName, data]: EventEmit) {
    this.server.to(socketId).emit(eventName, data ?? {});
  }

  emitToRoom(...[roomId, eventName, data]: EventEmit) {
    this.server.sockets.in(roomId).emit(eventName, data ?? {});
  }

  broadcastToRoom(socket, ...[roomId, eventName, data]: EventEmit) {
    socket.broadcast.to(roomId).emit(eventName, data ?? {});
  }

  async getSocket(roomId, socketId) {
    const sockets = await this.server.sockets.in(roomId).fetchSockets();

    return sockets.find((socket) => socket.id === socketId);
  }
}
