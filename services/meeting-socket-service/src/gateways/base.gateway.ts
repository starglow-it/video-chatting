import { OnGatewayConnection, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TEventEmitter } from '../types/socket-events';
import { MAX_EVENT_LISTENER } from '../const/common';
import { InjectWsErrorHandler } from '../utils/decorators/injectWsErrorHandler.decorator';
import { InjectWsGlobalGuard } from '../utils/decorators/injectWsGlobalGuard.decorator';
import { MeetingUserDocument } from '../schemas/meeting-user.schema';
import { UseInterceptors } from '@nestjs/common';
import { WsInterceptor } from '../interceptors/ws-interceptor';

@InjectWsGlobalGuard()
@InjectWsErrorHandler()
@UseInterceptors(WsInterceptor)
export class BaseGateway implements OnGatewayConnection {
  getUserFromSocket(socket: Socket): MeetingUserDocument {
    return socket.data['user'];
  }

  handleConnection(client: Socket) {
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

  async getSocket(roomId: string, socketId: string) {
    const sockets = await this.server.sockets.in(roomId).fetchSockets();

    return sockets.find((socket) => socket.id === socketId);
  }

  async joinRoom(socket: Socket, roomId: string) {
    const us = await this.getSocket(roomId, socket.id);
    if (!us) {
      socket.join(roomId);
    }
    return;
  }

  async leaveRoom(socket: Socket, roomId: string) {
    const us = await this.getSocket(roomId, socket.id);
    if (us) {
      socket.leave(roomId);
    }
    return;
  }
}
