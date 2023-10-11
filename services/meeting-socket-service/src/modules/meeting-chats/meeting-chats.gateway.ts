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
import {
  ITransactionSession,
  withTransaction,
} from '../../helpers/mongo/withTransaction';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { wsError } from '../../utils/ws/wsError';
import { meetingChatSerialization } from '../../dtos/response/meeting-chat.dto';
import { wsResult } from '../../utils/ws/wsResult';
import { LoadMoreMeetingChatRequestDto } from '../../dtos/requests/chats/loadmore-meeting-chat.dto';
import { MeetingSubscribeEvents } from '../../const/socket-events/subscribers';
import { MeetingEmitEvents } from '../../const/socket-events/emitters';
import { MESSAGES_LIMIT } from 'src/const/common';
import { ReactMeetingChatRequestDto } from 'src/dtos/requests/chats/react-meeting-chat.dto';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  UseFilters,
} from '@nestjs/common';
import { ObjectId } from 'src/utils/objectId';
import { MeetingReactionKind } from 'shared-types';
import { MeetingChat } from 'src/schemas/meeting-chat.schema';
import { MeetingChatReactionsService } from './meeting-chat-reactions.service';
import { userSerialization } from 'src/dtos/response/common-user.dto';
import { meetingChatReactionSerialization } from 'src/dtos/response/meeting-chat-reaction.dto';
import { MeetingUserDocument } from 'src/schemas/meeting-user.schema';
import { UnReactMeetingChatRequestDto } from 'src/dtos/requests/chats/unreact-meeting-chat.dto';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
// @UseFilters(WebsocketExceptionsFilter)
export class MeetingChatsGateway extends BaseGateway {
  constructor(
    private readonly meetingChatsService: MeetingChatsService,
    private readonly usersService: UsersService,
    private readonly meetingChatReactionsService: MeetingChatReactionsService,
    @InjectConnection() private readonly connection: Connection,
  ) {
    super();
  }

  private async getUserFromSocketId(
    socketId: string,
    session: ITransactionSession,
  ) {
    const user = await this.usersService.findOne({
      query: {
        socketId,
      },
      session,
    });

    if (!user) {
      throw new WsException('No user found');
    }
    return user;
  }

  private async getMeetingFromPopulateUser(user: MeetingUserDocument) {
    await user.populate('meeting');
    if (!user.meeting) {
      throw new WsException('No meeting found');
    }

    return user.meeting;
  }

  private caculateReactionsCount(
    reactionsList: MeetingChat['reactionsCount'],
    k: MeetingReactionKind,
    direction: 1 | -1,
  ) {
    const v = reactionsList.get(k);
    if (!v) {
      reactionsList.set(k, direction);
    } else {
      reactionsList.set(k, v + direction);
    }

    if (reactionsList.get(k) <= 0) {
      reactionsList.delete(k);
    }

    return reactionsList;
  }

  private checkReactionKind(kind: MeetingReactionKind) {
    return Object.values(MeetingReactionKind).includes(kind);
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnSendMessage)
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: SendMeetingChatRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.getUserFromSocketId(socket.id, session);
      const meeting = await this.getMeetingFromPopulateUser(user);
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
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnLoadMoreMessages)
  async loadMoreMessages(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { skip, limit }: LoadMoreMeetingChatRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.getUserFromSocketId(socket.id, session);
      const meeting = await this.getMeetingFromPopulateUser(user);
      const meetingChats = await this.meetingChatsService.findMany({
        query: {
          meeting: meeting._id,
          ...(!!user.lastOldMessage && {
            _id: {
              $gt: user.lastOldMessage,
            },
          }),
        },
        session,
        populatePaths: ['sender', 'meeting'],
        options: {
          sort: {
            createdAt: -1,
          },
          skip: skip * (limit || MESSAGES_LIMIT),
          limit: limit || MESSAGES_LIMIT,
        },
      });

      const plainMeetingChats = meetingChatSerialization(meetingChats);
      return wsResult({
        messages: plainMeetingChats,
      });
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnReactionMessage)
  async reactMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: ReactMeetingChatRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.getUserFromSocketId(socket.id, session);
      const meeting = await this.getMeetingFromPopulateUser(user);

      const message = await this.meetingChatsService.findOne({
        query: {
          _id: new ObjectId(msg.meetingChatId),
        },
        session,
      });
      if (!message) {
        throw new WsException('No message found');
      }

      if (!this.checkReactionKind(msg.kind)) {
        throw new WsException(`${msg.kind} not found`);
      }

      let userReaction =
        await this.meetingChatReactionsService.findOneAndUpdate({
          query: {
            user: user._id,
            meetingChat: message._id,
          },
          data: {
            kind: msg.kind,
          },
          session,
        });

      if (!userReaction) {
        await this.meetingChatReactionsService.create({
          data: {
            kind: msg.kind,
            meetingChat: message._id,
            user: user._id,
          },
          session,
        });
      }

      const rCount = this.caculateReactionsCount(
        message.reactionsCount,
        msg.kind,
        1,
      );

      const messageUpdated = await this.meetingChatsService.findOneAndUpdate({
        query: {
          _id: message._id,
        },
        data: {
          reactionsCount: rCount,
        },
        session,
      });

      const plainUserReaction = meetingChatReactionSerialization(userReaction);
      const plainMessage = meetingChatSerialization(messageUpdated);

      this.emitToRoom(
        `meeting:${meeting._id.toString()}`,
        MeetingEmitEvents.ReceiveReaction,
        {
          message: plainMessage,
          userReaction: plainUserReaction,
        },
      );

      return wsResult({
        message: plainMessage,
        userReaction: plainUserReaction,
      });
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnUnReactionMessage)
  async unreactMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: UnReactMeetingChatRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      const user = await this.getUserFromSocketId(socket.id, session);
      const meeting = await this.getMeetingFromPopulateUser(user);

      let message = await this.meetingChatsService.findOne({
        query: {
          _id: new ObjectId(msg.meetingChatId),
        },
        session,
      });

      if (!message) {
        throw new WsException('No message found');
      }

      const userReaction = await this.meetingChatReactionsService.findOne({
        query: {
          meetingChat: new ObjectId(msg.meetingChatId),
          user: user._id,
        },
        session,
      });

      const rC = this.caculateReactionsCount(
        message.reactionsCount,
        userReaction.kind,
        -1,
      );

      await this.meetingChatReactionsService.deleteOne({
        query: {
          meetingChat: new ObjectId(msg.meetingChatId),
          user: user._id,
        },
        session,
      });

      message = await this.meetingChatsService.findOneAndUpdate({
        query: {
          _id: new ObjectId(msg.meetingChatId),
        },
        data: {
          reactionsCount: rC,
        },
        session,
      });

      const plainMessage = meetingChatSerialization(message);
      const plainUser = userSerialization(user);

      this.emitToRoom(
        `meeting:${meeting._id.toString()}`,
        MeetingEmitEvents.ReceiveUnReaction,
        {
          message: plainMessage,
          user: plainUser,
        },
      );

      return wsResult({
        message: plainMessage,
        user: plainUser,
      });
    });
  }
}
