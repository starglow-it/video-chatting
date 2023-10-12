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
import { meetingChatSerialization } from '../../dtos/response/meeting-chat.dto';
import { wsResult } from '../../utils/ws/wsResult';
import { LoadMoreMeetingChatRequestDto } from '../../dtos/requests/chats/loadmore-meeting-chat.dto';
import { MeetingSubscribeEvents } from '../../const/socket-events/subscribers';
import { MeetingEmitEvents } from '../../const/socket-events/emitters';
import { MESSAGES_LIMIT } from '../../const/common';
import { ReactMeetingChatRequestDto } from '../../dtos/requests/chats/react-meeting-chat.dto';
import { ObjectId } from '../../utils/objectId';
import { MeetingReactionKind } from 'shared-types';
import { MeetingChat } from '../../schemas/meeting-chat.schema';
import { MeetingChatReactionsService } from './meeting-chat-reactions.service';
import { userSerialization } from '../../dtos/response/common-user.dto';
import { meetingChatReactionSerialization } from '../../dtos/response/meeting-chat-reaction.dto';
import { MeetingUserDocument } from '../../schemas/meeting-user.schema';
import { UnReactMeetingChatRequestDto } from '../../dtos/requests/chats/unreact-meeting-chat.dto';
import { WsBadRequestException } from '../../exceptions/ws.exception';

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
      throw new WsBadRequestException('No user found');
    }
    return user;
  }

  private async getMeetingFromPopulateUser(user: MeetingUserDocument) {
    await user.populate('meeting');
    if (!user.meeting) {
      throw new WsBadRequestException('No meeting found');
    }

    return user.meeting;
  }

  private caculateReactions(
    reactionsList: MeetingChat['reactions'],
    k: MeetingReactionKind,
    user: MeetingUserDocument,
    direaction: 'asc' | 'desc',
  ) {
    const v = reactionsList.get(k);
    if (!v) {
      reactionsList.set(k, [user]);
    } else {
      direaction === 'asc'
        ? v.push(user)
        : delete v[
            v.findIndex((u) => u._id.toString() === user._id.toString())
          ];
      reactionsList.set(k, v);
    }

    if (reactionsList.get(k).length < 1) {
      reactionsList.delete(k);
    }

    return reactionsList;
  }

  private checkReactionKind(kind: MeetingReactionKind) {
    return Object.values(MeetingReactionKind).includes(kind);
  }

  private async getMessageById(
    messageId: string,
    session: ITransactionSession,
  ) {
    const m = await this.meetingChatsService.findOne({
      query: {
        _id: new ObjectId(messageId),
      },
      session,
    });

    if (!m) {
      throw new WsBadRequestException('No message found');
    }
    return m;
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnSendMessage)
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: SendMeetingChatRequestDto,
  ) {
    console.debug(`Event ${MeetingSubscribeEvents.OnSendMessage}`);
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
    console.debug(`Event ${MeetingSubscribeEvents.OnLoadMoreMessages}`);
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
      console.debug(`Event ${MeetingSubscribeEvents.OnReactionMessage}`);
      const user = await this.getUserFromSocketId(socket.id, session);
      const meeting = await this.getMeetingFromPopulateUser(user);

      const message = await this.getMessageById(msg.meetingChatId, session);

      if (!this.checkReactionKind(msg.kind)) {
        throw new WsBadRequestException(`${msg.kind} not found`);
      }

      let reaction = await this.meetingChatReactionsService.findOneAndUpdate({
        query: {
          user: user._id,
          meetingChat: message._id,
        },
        data: {
          kind: MeetingReactionKind.Heart,
        },
        session,
      });

      if (!reaction) {
        reaction = await this.meetingChatReactionsService.create({
          data: {
            kind: MeetingReactionKind.Heart,
            meetingChat: message._id,
            user: user._id,
          },
          session,
        });
      }

      const reactions = this.caculateReactions(
        message.reactions,
        reaction.kind,
        user,
        'asc',
      );

      message.reactions = reactions;
      message.save();

      await reaction.populate(['meetingChat', 'user']);

      const plainReaction = meetingChatReactionSerialization(reaction);

      this.emitToRoom(
        `meeting:${meeting._id.toString()}`,
        MeetingEmitEvents.ReceiveReaction,
        {
          reaction: plainReaction,
        },
      );

      return wsResult({
        reaction: plainReaction,
      });
    });
  }

  @SubscribeMessage(MeetingSubscribeEvents.OnUnReactionMessage)
  async unreactMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: UnReactMeetingChatRequestDto,
  ) {
    console.debug(`Event ${MeetingSubscribeEvents.OnUnReactionMessage}`);
    return withTransaction(this.connection, async (session) => {
      const user = await this.getUserFromSocketId(socket.id, session);
      const meeting = await this.getMeetingFromPopulateUser(user);

      let message = await this.getMessageById(msg.meetingChatId, session);

      const userReaction = await this.meetingChatReactionsService.findOne({
        query: {
          meetingChat: new ObjectId(msg.meetingChatId),
          user: user._id,
        },
        session,
      });

      const reactions = this.caculateReactions(
        message.reactions,
        userReaction.kind,
        user,
        'desc',
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
          reactions,
        },
        session,
      });

      const plainMessage = meetingChatSerialization(message);

      this.emitToRoom(
        `meeting:${meeting._id.toString()}`,
        MeetingEmitEvents.ReceiveUnReaction,
        {
          message: plainMessage,
        },
      );

      return wsResult({
        message: plainMessage,
      });
    });
  }
}
