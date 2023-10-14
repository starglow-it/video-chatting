import { Module } from '@nestjs/common';
import { MeetingChatsGateway } from './meeting-chats.gateway';
import { MeetingChatsService } from './meeting-chats.service';
import { UsersModule } from '../users/users.module';
import { MeetingsModule } from '../meetings/meetings.module';
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
    UsersModule,
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
    MeetingChatsGateway,
    MeetingChatsService,
    MeetingChatReactionsService,
  ],
  exports: [MeetingChatsService, MeetingChatReactionsService],
})
export class MeetingChatsModule {}
