import {
  ConnectedSocket,
  MessageBody,
  WebSocketGateway,
} from '@nestjs/websockets';
import { InjectConnection } from '@nestjs/mongoose';
import { Socket } from 'socket.io';
import { Connection } from 'mongoose';

import { BaseGateway } from './base.gateway';

import { UsersService } from '../modules/users/users.service';
import { withTransaction } from '../helpers/mongo/withTransaction';
import { SendMeetingReactionRequestDTO } from '../dtos/requests/reactions/send-meeting-reaction.dto';
import { MeetingReactionsService } from '../modules/meeting-reactions/meeting-reactions.service';
import { MeetingReactionDTO } from '../dtos/response/meeting-reaction.dto';
import { RemoveMeetingReactionRequestDTO } from '../dtos/requests/reactions/remove-meeting-reaction.dto';
import { plainToInstance } from 'class-transformer';
import { MeetingSubscribeEvents } from '../const/socket-events/subscribers';
import { MeetingEmitEvents } from '../const/socket-events/emitters';
import { subscribeWsError, wsError } from '../utils/ws/wsError';
import { WsEvent } from '../utils/decorators/wsEvent.decorator';
import { wsResult } from '../utils/ws/wsResult';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class MeetingReactionsGateway extends BaseGateway {
  constructor(
    private usersService: UsersService,
    private meetingReactionsService: MeetingReactionsService,
    @InjectConnection() private connection: Connection,
  ) {
    super();
  }

  @WsEvent(MeetingSubscribeEvents.OnSendMeetingReaction)
  async sendMeetingReaction(
    @MessageBody() message: SendMeetingReactionRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = await this.usersService.findOne({
          query: { socketId: socket.id },
          session,
          populatePaths: 'meeting',
        });

        const [newReaction] = await this.meetingReactionsService.create(
          {
            user: user._id,
            meeting: user.meeting._id,
            emojiName: message.emojiName,
          },
          session,
        );

        const meetingReaction = plainToInstance(MeetingReactionDTO, newReaction, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        this.emitToRoom(
          `meeting:${user.meeting._id}`,
          MeetingEmitEvents.SendMeetingReaction,
          {
            meetingReactions: [meetingReaction],
          },
        );

        return wsResult();
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnRemoveMeetingReaction)
  async removeMeetingReaction(
    @MessageBody() message: RemoveMeetingReactionRequestDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        await this.meetingReactionsService.deleteOne(
          { _id: message.reactionId },
          session,
        );

        this.emitToRoom(
          `meeting:${user.meeting.toString()}`,
          MeetingEmitEvents.RemoveMeetingReaction,
          {
            meetingReactionId: message.reactionId,
          },
        );
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnGetMeetingReaction)
  async getMeetingReactions(@ConnectedSocket() socket: Socket) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const meetingReactions = await this.meetingReactionsService.findMany({
          query: { meeting: user.meeting },
          session,
          populatePaths: 'user',
        });

        const plainMeetingReactions = plainToInstance(
          MeetingReactionDTO,
          meetingReactions,
          {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          },
        );

        return wsResult({
          meetingReactions: plainMeetingReactions,
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }
}
