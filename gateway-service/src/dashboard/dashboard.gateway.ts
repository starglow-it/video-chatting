import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import {Global, Logger} from '@nestjs/common';
import {Socket} from "socket.io";

import {JOIN_DASHBOARD, JOIN_ROOM_BEFORE_MEETING, SEND_MEETING_AVAILABLE} from "../const/socket.events";
import {BaseGateway} from "../gateway/base.gateway";
import {TemplatesService} from "../templates/templates.service";
import {CoreService} from "../core/core.service";

@Global()
@WebSocketGateway({ transports: ['websocket', 'polling'] })
export class DashboardGateway extends BaseGateway {
  private readonly logger = new Logger(DashboardGateway.name);

  constructor(
      private templatesService: TemplatesService,
      private coreService: CoreService,
  ) {
    super();
  }

  @SubscribeMessage(JOIN_DASHBOARD)
  async joinDashboard(
      @MessageBody() message: { userId: string },
      @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`User joined dashboard room`);

    const user = await this.coreService.findUserById({
      userId: message.userId,
    });

    socket.join(`dashboard:${user.id}`);
  }

  @SubscribeMessage(JOIN_ROOM_BEFORE_MEETING)
  async joinWaitingRoom(
      @MessageBody() message: { templateId: string },
      @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`User joined waiting room ${message.templateId}`);
    socket.join(`waitingRoom:${message.templateId}`);

    const template = await this.templatesService.getUserTemplate({
      id: message.templateId,
    });

    this.emitToRoom(`dashboard:${template.user}`, 'waitingRoom:user-joined', {  });
  }

  @SubscribeMessage(SEND_MEETING_AVAILABLE)
  async sendMeetingAvailable(
      @MessageBody() message: { templateId: string },
      @ConnectedSocket() socket: Socket,
  ) {
    this.emitToRoom(`waitingRoom:${message.templateId}`, 'waitingRoom:meetingAvailable', message);
  }
}
