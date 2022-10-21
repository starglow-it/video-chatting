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

import { IUserTemplate } from 'shared';
import { withTransaction } from '../../helpers/mongo/withTransaction';
import { MeetingsService } from '../meetings/meetings.service';
import { MeetingSubscribeEvents } from '../../const/socket-events/subscribers';
import { MeetingEmitEvents } from '../../const/socket-events/emitters';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class TemplatesGateway extends BaseGateway {
  constructor(
    private meetingsService: MeetingsService,
    private usersService: UsersService,
    @InjectConnection() private connection: Connection,
  ) {
    super();
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnUpdateMeetingTemplate)
  async updateMeetingTemplate(
    @MessageBody() data: { templateId: IUserTemplate['id'] },
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
