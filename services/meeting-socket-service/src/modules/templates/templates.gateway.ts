import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

import { BaseGateway } from '../../gateway/base.gateway';

import { UsersService } from '../users/users.service';

import { withTransaction } from '../../helpers/mongo/withTransaction';
import { MeetingsService } from '../meetings/meetings.service';
import { MeetingSubscribeEvents } from '../../const/socket-events/subscribers';
import { MeetingEmitEvents } from '../../const/socket-events/emitters';
import { UpdateMeetingTemplateRequestDto } from '../../dtos/requests/templates/update-template.dto';
import { UpdatePaymentRequestDto } from '../../dtos/requests/payment/update-payment.dto';
import { WsBadRequestException } from '../../exceptions/ws.exception';
import { MeetingNativeErrorEnum } from 'shared-const';
import { MeetingUserDocument } from '../../schemas/meeting-user.schema';
import { Roles } from 'src/utils/decorators/role.decorator';
import { MeetingRole } from 'shared-types';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class TemplatesGateway extends BaseGateway {
  constructor(
    private usersService: UsersService,
    @InjectConnection() private connection: Connection,
  ) {
    super();
  }

  @Roles([MeetingRole.Host])
  @SubscribeMessage(MeetingSubscribeEvents.OnUpdateTemplatePayments)
  async updateMeetingPayments(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: UpdatePaymentRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      const user = this.getUserFromSocket(socket);
      this.emitToRoom(
        `meeting:${user.meeting.toString()}`,
        MeetingEmitEvents.UpdateTemplatePayments,
        {
          ...msg,
        },
      );
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnUpdateMeetingTemplate)
  async updateMeetingTemplate(
    @MessageBody() data: UpdateMeetingTemplateRequestDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findOne({
        query: { socketId: socket.id },
        session,
        populatePaths: 'meeting',
      });

      if (user) {
        this.emitToRoom(
          `meeting:${user.meeting._id}`,
          MeetingEmitEvents.UpdateMeetingTemplate,
          { templateId: data.templateId },
        );
      }
    });
  }
}
