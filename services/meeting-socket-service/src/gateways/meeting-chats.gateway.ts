import {
  ConnectedSocket,
  MessageBody,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BaseGateway } from './base.gateway';
import { MeetingChatsService } from '../modules/meeting-chats/meeting-chats.service';
import { SendMeetingChatRequestDto } from '../dtos/requests/chats/send-meeting-chat.dto';
import {
  ITransactionSession,
  withTransaction,
} from '../helpers/mongo/withTransaction';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { meetingChatSerialization } from '../dtos/response/meeting-chat.dto';
import { wsResult } from '../utils/ws/wsResult';
import { LoadMoreMeetingChatRequestDto } from '../dtos/requests/chats/loadmore-meeting-chat.dto';
import { MeetingSubscribeEvents } from '../const/socket-events/subscribers';
import { MeetingEmitEvents } from '../const/socket-events/emitters';
import { MESSAGES_LIMIT } from '../const/common';
import { ReactMeetingChatRequestDto } from '../dtos/requests/chats/react-meeting-chat.dto';
import { ObjectId } from '../utils/objectId';
import { MeetingReactionKind } from 'shared-types';
import { MeetingChat } from '../schemas/meeting-chat.schema';
import { MeetingChatReactionsService } from '../modules/meeting-chats/meeting-chat-reactions.service';
import { meetingChatReactionSerialization } from '../dtos/response/meeting-chat-reaction.dto';
import { MeetingUserDocument } from '../schemas/meeting-user.schema';
import { UnReactMeetingChatRequestDto } from '../dtos/requests/chats/unreact-meeting-chat.dto';
import { WsBadRequestException } from '../exceptions/ws.exception';
import { UsersComponent } from '../modules/users/users.component';
import { WsEvent } from 'src/utils/decorators/wsEvent.decorator';
import { subscribeWsError, wsError } from 'src/utils/ws/wsError';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class MeetingChatsGateway extends BaseGateway {
  constructor(
    private readonly meetingChatsService: MeetingChatsService,
    private readonly usersComponent: UsersComponent,
    private readonly meetingChatReactionsService: MeetingChatReactionsService,
    @InjectConnection() private readonly connection: Connection,
  ) {
    super();
  }

  private caculateReactions(
    reactionsList: MeetingChat['reactions'],
    k: MeetingReactionKind,
    user: MeetingUserDocument,
    direaction: 'asc' | 'desc',
  ) {
    const v = reactionsList.get(k);
    const compareUsers = (
      user: MeetingUserDocument,
      otherUser: MeetingUserDocument,
    ) => user._id.toString() === otherUser._id.toString();
    const isExistUser = () => v.some((u) => compareUsers(u, user));
    const findIndex = () => v.findIndex((u) => compareUsers(u, user));
    const deleteUser = () => v.splice(findIndex(), 1);
    if (!v) {
      reactionsList.set(k, [user]);
    } else {
      direaction === 'asc' ? !isExistUser() && v.push(user) : deleteUser();

      reactionsList.set(k, v);
    }

    if (reactionsList.get(k).length < 1) {
      reactionsList.delete(k);
    }

    return reactionsList;
  }

  private checkReactionKind(kind: MeetingReactionKind) {
    const isExistKind = Object.values(MeetingReactionKind).includes(kind);
    if (!isExistKind) {
      throw new WsBadRequestException(`${kind} not found`);
    }
    return isExistKind;
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

  @WsEvent(MeetingSubscribeEvents.OnSendMessage)
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: SendMeetingChatRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const meeting = await this.usersComponent.findMeetingFromPopulateUser(
          user,
        );
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
        return wsError(socket, err);
      }
    });
  }

  @WsEvent(MeetingSubscribeEvents.OnLoadMoreMessages)
  async loadMoreMessages(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { skip, limit }: LoadMoreMeetingChatRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const meeting = await this.usersComponent.findMeetingFromPopulateUser(
          user,
        );
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
      } catch (err) {
        return wsError(socket, err);
      }
    });
  }

  @WsEvent(MeetingSubscribeEvents.OnReactionMessage)
  async reactMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: ReactMeetingChatRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const meeting = await this.usersComponent.findMeetingFromPopulateUser(
          user,
        );

        const message = await this.getMessageById(msg.meetingChatId, session);

        this.checkReactionKind(msg.kind);

        const reactions = this.caculateReactions(
          message.reactions,
          msg.kind,
          user,
          'asc',
        );

        message.reactions = reactions;
        message.save();

        let reaction = await this.meetingChatReactionsService.findOne({
          query: {
            user: user._id,
            meetingChat: message._id,
            kind: msg.kind,
          },
          session,
        });

        if (!reaction) {
          reaction = await this.meetingChatReactionsService.create({
            data: {
              kind: msg.kind,
              meetingChat: message._id,
              user: user._id,
              meeting: meeting._id,
            },
            session,
          });
        }

        await reaction.populate([
          {
            path: 'meetingChat',
            populate: ['sender'],
          },
          'user',
        ]);

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
      } catch (err) {
        return wsError(socket, err);
      }
    });
  }

  @WsEvent(MeetingSubscribeEvents.OnUnReactionMessage)
  async unreactMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: UnReactMeetingChatRequestDto,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const meeting = await this.usersComponent.findMeetingFromPopulateUser(
          user,
        );

        let message = await this.getMessageById(msg.meetingChatId, session);

        this.checkReactionKind(msg.kind);

        const reactions = this.caculateReactions(
          message.reactions,
          msg.kind,
          user,
          'desc',
        );

        await this.meetingChatReactionsService.deleteOne({
          query: {
            meetingChat: new ObjectId(msg.meetingChatId),
            user: user._id,
            kind: msg.kind,
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

        await message.populate('sender');

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
      } catch (err) {
        return wsError(socket, err);
      }
    });
  }
}
