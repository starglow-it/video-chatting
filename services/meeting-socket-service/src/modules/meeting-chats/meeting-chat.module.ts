import { Module } from '@nestjs/common';
import { MeetingChatsGateway } from './meeting-chats.gateway';
import { MeetingChatsService } from './meeting-chats.service';
import { UsersModule } from '../users/users.module';
import { MeetingsModule } from '../meetings/meetings.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingChat, MeetingChatSchema } from 'src/schemas/meeting-chat.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: MeetingChat.name,
        schema: MeetingChatSchema,
      },
    ]),
  ],
  providers: [MeetingChatsGateway, MeetingChatsService],
  exports: [MeetingChatsService],
})
export class MeetingChatsModule {}
