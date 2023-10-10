import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TEventEmitter } from '../types/socket-events';
import { MAX_EVENT_LISTENER } from '../const/common';

export class BaseGateway implements OnGatewayConnection {
  handleConnection(client: Socket, ...args: any[]) {
    client.setMaxListeners(MAX_EVENT_LISTENER);
  }

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
