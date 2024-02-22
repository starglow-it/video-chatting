import {
  ConnectedSocket,
  MessageBody,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BaseGateway } from './base.gateway';
import { MeetingQuestionAnswersService } from '../modules/meeting-question-answer/meeting-question-answer.service';
import { SendMeetingQuestionRequestDto } from '../dtos/requests/questions/send-meeting-question.dto';
import {
  ITransactionSession,
  withTransaction,
} from '../helpers/mongo/withTransaction';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { meetingQuestionAnswerSerialization } from '../dtos/response/meeting-question-answer.dto';
import { wsResult } from '../utils/ws/wsResult';
import { LoadMoreMeetingQuestionRequestDto } from '../dtos/requests/questions/loadmore-meeting-question.dto';
import { MeetingSubscribeEvents } from '../const/socket-events/subscribers';
import { MeetingEmitEvents } from '../const/socket-events/emitters';
import { MESSAGES_LIMIT } from '../const/common';
import { ReactMeetingQuestionRequestDto } from '../dtos/requests/questions/react-meeting-question.dto';
import { ObjectId } from '../utils/objectId';
import { MeetingReactionKind } from 'shared-types';
import { MeetingQuestionAnswer } from '../schemas/meeting-question-answer.schema';
import { MeetingQuestionAnswerReactionsService } from '../modules/meeting-question-answer/meeting-question-answer-reactions.service';
import { meetingQuestionAnswerReactionSerialization } from '../dtos/response/meeting-question-answer-reaction.dto';
import { MeetingUserDocument } from '../schemas/meeting-user.schema';
import { UnReactMeetingQuestionRequestDto } from '../dtos/requests/questions/unreact-meeting-question.dto';
import { WsBadRequestException } from '../exceptions/ws.exception';
import { UsersComponent } from '../modules/users/users.component';
import { WsEvent } from '../utils/decorators/wsEvent.decorator';
import { subscribeWsError, wsError } from '../utils/ws/wsError';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class MeetingQuestionAnswersGateway extends BaseGateway {
  constructor(
    private readonly meetingQuestionAnswersService: MeetingQuestionAnswersService,
    private readonly usersComponent: UsersComponent,
    private readonly meetingQuestionAnswerReactionsService: MeetingQuestionAnswerReactionsService,
    @InjectConnection() private readonly connection: Connection,
  ) {
    super();
  }

  private caculateReactions(
    reactionsList: MeetingQuestionAnswer['reactions'],
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
    const m = await this.meetingQuestionAnswersService.findOne({
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

  @WsEvent(MeetingSubscribeEvents.OnSendQuestion)
  async sendQuestion(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: SendMeetingQuestionRequestDto,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const meeting = await this.usersComponent.findMeetingFromPopulateUser(
          user,
        );
        const meetingQuestionAnswer = await this.meetingQuestionAnswersService.create({
          data: {
            body: msg.body,
            meeting: meeting._id,
            sender: user._id,
          },
          session,
        });

        await meetingQuestionAnswer.populate(['meeting', 'sender']);

        const plainMeetingQuestionAnswer = meetingQuestionAnswerSerialization(meetingQuestionAnswer);
        
        const host = await this.usersComponent.findOne({
          query: {
            _id: meeting.hostUserId,
          },
          session,
        });

        
        this.emitToSocketId(host?.socketId, MeetingEmitEvents.ReceiveQuestion, {
          question: plainMeetingQuestionAnswer,
        });

        
        this.emitToSocketId(user?.socketId, MeetingEmitEvents.ReceiveQuestion, {
          question: plainMeetingQuestionAnswer,
        });

        return wsResult({
          question: plainMeetingQuestionAnswer,
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnLoadMoreQuestions)
  async loadMoreQuestions(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { skip, limit }: LoadMoreMeetingQuestionRequestDto,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const meeting = await this.usersComponent.findMeetingFromPopulateUser(
          user,
        );
        const meetingQuestionAnswers = await this.meetingQuestionAnswersService.findMany({
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

        const plainMeetingQuestionAnswers = meetingQuestionAnswerSerialization(meetingQuestionAnswers);
        return wsResult({
          messages: plainMeetingQuestionAnswers,
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnReactionQuestion)
  async reactQuestion(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: ReactMeetingQuestionRequestDto,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const meeting = await this.usersComponent.findMeetingFromPopulateUser(
          user,
        );

        const message = await this.getMessageById(msg.meetingQuestionId, session);

        this.checkReactionKind(msg.kind);

        const reactions = this.caculateReactions(
          message.reactions,
          msg.kind,
          user,
          'asc',
        );

        message.reactions = reactions;
        message.save();

        let reaction = await this.meetingQuestionAnswerReactionsService.findOne({
          query: {
            user: user._id,
            meetingQuestionAnswer: message._id,
            kind: msg.kind,
          },
          session,
        });

        if (!reaction) {
          reaction = await this.meetingQuestionAnswerReactionsService.create({
            data: {
              kind: msg.kind,
              meetingQuestionAnswer: message._id,
              user: user._id,
              meeting: meeting._id,
            },
            session,
          });
        }

        await reaction.populate([
          {
            path: 'meetingQuestionAnswer',
            populate: ['sender'],
          },
          'user',
        ]);

        const plainReaction = meetingQuestionAnswerReactionSerialization(reaction);

        this.emitToRoom(
          `meeting:${meeting._id.toString()}`,
          MeetingEmitEvents.ReceiveQuestionReaction,
          {
            reaction: plainReaction,
          },
        );

        return wsResult({
          reaction: plainReaction,
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }

  @WsEvent(MeetingSubscribeEvents.OnUnReactionQuestion)
  async unreactQuestionMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: UnReactMeetingQuestionRequestDto,
  ) {
    return withTransaction(
      this.connection,
      async (session) => {
        subscribeWsError(socket);
        const user = this.getUserFromSocket(socket);
        const meeting = await this.usersComponent.findMeetingFromPopulateUser(
          user,
        );

        let message = await this.getMessageById(msg.meetingQuestionId, session);

        this.checkReactionKind(msg.kind);

        const reactions = this.caculateReactions(
          message.reactions,
          msg.kind,
          user,
          'desc',
        );

        await this.meetingQuestionAnswerReactionsService.deleteOne({
          query: {
            meetingQuestionAnswer: new ObjectId(msg.meetingQuestionId),
            user: user._id,
            kind: msg.kind,
          },
          session,
        });

        message = await this.meetingQuestionAnswersService.findOneAndUpdate({
          query: {
            _id: new ObjectId(msg.meetingQuestionId),
          },
          data: {
            reactions,
          },
          session,
        });

        await message.populate('sender');

        const plainMessage = meetingQuestionAnswerSerialization(message);

        this.emitToRoom(
          `meeting:${meeting._id.toString()}`,
          MeetingEmitEvents.ReceiveQuestionUnReaction,
          {
            question: plainMessage,
          },
        );

        return wsResult({
          message: plainMessage,
        });
      },
      {
        onFinaly: (err) => wsError(socket, err),
      },
    );
  }
}
