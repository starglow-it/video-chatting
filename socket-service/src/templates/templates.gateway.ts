import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Global } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

import { BaseGateway } from '../gateway/base.gateway';

import { UsersService } from '../users/users.service';

import SubscribeEvents from '../const/socketEvents.const';
import EmitEvents from '../const/emitSocketEvents.const';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import { withTransaction } from '../helpers/mongo/withTransaction';
import { MeetingsService } from '../meetings/meetings.service';

@Global()
@WebSocketGateway({ transports: ['websocket', 'polling'] })
export class TemplatesGateway extends BaseGateway {
  constructor(
    private meetingsService: MeetingsService,
    private usersService: UsersService,
    @InjectConnection() private connection: Connection,
  ) {
    super();
  }

  @SubscribeMessage(SubscribeEvents.UPDATE_MEETING_TEMPLATE)
  async updateMeetingTemplate(
    @MessageBody() data: { templateId: IUserTemplate['id'] },
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.usersService.findOne(
        { socketId: socket.id },
        session,
      );

      if (user) {
        await user.populate('meeting');

        this.emitToRoom(
            `meeting:${user.meeting._id}`,
            EmitEvents.UPDATE_MEETING_TEMPLATE,
            { templateId: data.templateId },
        );
      }
    });
  }
}
