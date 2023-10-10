import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MeetingChatEmitEvents } from 'src/const/socket-events/emitters/meetingchat';
import { MeetingChatSubcribeEvent } from 'src/const/socket-events/subscribers';
import { BaseGateway } from '../../gateway/base.gateway';
import { MeetingChatsService } from './meeting-chats.service';
import { UsersService } from '../users/users.service';
import { MeetingsService } from '../meetings/meetings.service';
import { SendMeetingChatRequestDto } from 'src/dtos/requests/chats/send-meeting-chat.dto';
import { withTransaction } from 'src/helpers/mongo/withTransaction';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { wsError } from 'src/utils/ws/wsError';
import { meetingChatSerialization } from 'src/dtos/response/meeting-chat.dto';
import { wsResult } from 'src/utils/ws/wsResult';
import { LoadMoreMeetingChatRequestDto } from 'src/dtos/requests/chats/loadmore-meeting-chat.dto';

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

  @SubscribeMessage(MeetingChatSubcribeEvent.OnSendMessage)
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

        const plainMeetingChat = meetingChatSerialization(meetingChat);
        this.emitToRoom(
          `meeting:${meeting._id.toString()}`,
          MeetingChatEmitEvents.ReceiveMessage,
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

  @SubscribeMessage(MeetingChatSubcribeEvent.OnLoadMoreMessages)
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

  @SubscribeMessage(MeetingChatSubcribeEvent.OnReactionMessage)
  async reactMessage() {}

  @SubscribeMessage(MeetingChatSubcribeEvent.OnUnReactionMessage)
  async unreactMessage() {}
}
