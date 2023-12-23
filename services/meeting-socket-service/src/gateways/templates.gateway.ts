import {
  ConnectedSocket,
  MessageBody,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

import { BaseGateway } from './base.gateway';

import { withTransaction } from '../helpers/mongo/withTransaction';
import { MeetingSubscribeEvents } from '../const/socket-events/subscribers';
import { MeetingEmitEvents } from '../const/socket-events/emitters';
import { UpdateMeetingTemplateRequestDto } from '../dtos/requests/templates/update-template.dto';
import { UpdatePaymentRequestDto } from '../dtos/requests/payment/update-payment.dto';
import { Roles } from '../utils/decorators/role.decorator';
import { MeetingRole } from 'shared-types';
import { subscribeWsError, wsError } from '../utils/ws/wsError';
import { WsEvent } from '../utils/decorators/wsEvent.decorator';
import { wsResult } from '../utils/ws/wsResult';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class TemplatesGateway extends BaseGateway {
  constructor(@InjectConnection() private connection: Connection) {
    super();
  }

  @Roles([MeetingRole.Host])
  @WsEvent(MeetingSubscribeEvents.OnUpdateTemplatePayments)
  async updateMeetingPayments(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: UpdatePaymentRequestDto[],
  ) {
    return withTransaction(this.connection, async () => {
      subscribeWsError(socket);
      const user = this.getUserFromSocket(socket);
      this.emitToRoom(
        `meeting:${user.meeting.toString()}`,
        MeetingEmitEvents.UpdateTemplatePayments,
        msg,
      );
      return wsResult();
    });
  }

  @Roles([MeetingRole.Host])
  @WsEvent(MeetingSubscribeEvents.OnUpdateMeetingTemplate)
  async updateMeetingTemplate(
    @MessageBody() data: UpdateMeetingTemplateRequestDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(this.connection, async () => {
      subscribeWsError(socket);
      const user = this.getUserFromSocket(socket);
      this.emitToRoom(
        `meeting:${user.meeting.toString()}`,
        MeetingEmitEvents.UpdateMeetingTemplate,
        { templateId: data.templateId },
      );

      this.emitToRoom(
        `waitingRoom:${data.templateId}`,
        MeetingEmitEvents.UpdateMeetingTemplate,
        { templateId: data.templateId },
      );
      return wsResult();
    });
  }
}
