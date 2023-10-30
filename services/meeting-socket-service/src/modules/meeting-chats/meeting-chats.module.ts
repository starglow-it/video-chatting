import { Module } from '@nestjs/common';
import { MeetingChatsGateway } from '../../gateways/meeting-chats.gateway';
import { MeetingChatsService } from './meeting-chats.service';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MeetingChat,
  MeetingChatSchema,
} from '../../schemas/meeting-chat.schema';
import { MeetingChatReactionsService } from './meeting-chat-reactions.service';
import {
  MeetingChatReaction,
  MeetingChatReactionSchema,
} from '../../schemas/meeting-chat-reaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MeetingChat.name,
        schema: MeetingChatSchema,
      },
      {
        name: MeetingChatReaction.name,
        schema: MeetingChatReactionSchema,
      },
    ]),
  ],
  providers: [
    MeetingChatsService,
    MeetingChatReactionsService,
  ],
  exports: [MeetingChatsService, MeetingChatReactionsService],
})
export class MeetingChatsModule {}
