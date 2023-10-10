import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BaseGateway } from '../../gateway/base.gateway';
import { MeetingChatsService } from './meeting-chats.service';
import { UsersService } from '../users/users.service';
import { SendMeetingChatRequestDto } from '../../dtos/requests/chats/send-meeting-chat.dto';
import { withTransaction } from '../../helpers/mongo/withTransaction';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { wsError } from '../../utils/ws/wsError';
import { meetingChatSerialization } from '../../dtos/response/meeting-chat.dto';
import { wsResult } from '../../utils/ws/wsResult';
import { LoadMoreMeetingChatRequestDto } from '../../dtos/requests/chats/loadmore-meeting-chat.dto';
import { MeetingSubscribeEvents } from '../../const/socket-events/subscribers';
import { MeetingEmitEvents } from '../../const/socket-events/emitters';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class MeetingChatsGateway extends BaseGateway {
  constructor(
    private readonly meetingChatsService: MeetingChatsService,
    private readonly usersService: UsersService,
    @InjectConnection() private readonly connection: Connection,
  ) {
    super();
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnSendMessage)
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: SendMeetingChatRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const user = await this.usersService.findOne({
          query: {
            socketId: socket.id,
          },
          session,
        });
        if (!user) {
          return wsError(socket.id, {
            message: 'No user found',
          });
        }
        await user.populate('meeting');
        if (!user.meeting) {
          return wsError(socket.id, {
            message: 'Meeting not found',
          });
        }

        const meeting = user.meeting;
        const meetingChat = await this.meetingChatsService.create({
          data: {
            body: msg.body,
            meeting: meeting._id,
            sender: user._id,
          },
          session,
        });
        await meetingChat.populate(['meeting', 'sender']);

        const plainMeetingChat = meetingChatSerialization(meetingChat);
        this.emitToRoom(
          `meeting:${meeting._id.toString()}`,
          MeetingEmitEvents.ReceiveMessage,
          {
            message: plainMeetingChat,
          },
        );

        return wsResult({
          message: plainMeetingChat,
        });
      } catch (err) {
        return wsError(socket.id, err);
      }
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnLoadMoreMessages)
  async loadMoreMessages(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { skip, limit }: LoadMoreMeetingChatRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const user = await this.usersService.findOne({
          query: {
            socketId: socket.id,
          },
          session,
        });
        if (!user) {
          return wsError(socket.id, {
            message: 'No user found',
          });
        }
        await user.populate('meeting');
        if (!user.meeting) {
          return wsError(socket.id, {
            message: 'Meeting not found',
          });
        }
        const meeting = user.meeting;

        const meetingChats = await this.meetingChatsService.findMany({
          query: {
            meeting: meeting._id,
          },
          session,
          options: {
            sort: {
              createdAt: -1,
            },
            skip: skip * limit,
            limit,
          },
        });

        const plainMeetingChats = meetingChatSerialization(meetingChats);
        return wsResult({
          messages: plainMeetingChats,
        });
      } catch (err) {
        return wsError(socket.id, err);
      }
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnReactionMessage)
  async reactMessage() {}

  @SubscribeMessage(MeetingSubscribeEvents.OnUnReactionMessage)
  async unreactMessage() {}
}
