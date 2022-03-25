import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ transports: ['websocket'] })
export class BaseGateway {
  @WebSocketServer() server: Server;

  emitToSocketId(socketId: string, eventName: string, data: any = {}) {
    this.server.to(socketId).emit(eventName, data);
  }

  emitToRoom(roomId: string, eventName: string, data: any = {}) {
    this.server.sockets.in(roomId).emit(eventName, data);
  }

  async getSocket(roomId, socketId) {
    const sockets = await this.server.sockets.in(roomId).fetchSockets();

    return sockets.find((socket) => socket.id === socketId);
  }
}
