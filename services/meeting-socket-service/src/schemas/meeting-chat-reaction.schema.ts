import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { MeetingUser, MeetingUserDocument } from './meeting-user.schema';
import { MeetingChat, MeetingChatDocument } from './meeting-chat.schema';
import { MeetingReactionKind } from 'shared-types';

@Schema()
export class MeetingChatReaction {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: MeetingChat.name,
    default: false,
  })
  meetingChat: MeetingChatDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: MeetingUser.name,
  })
  user: MeetingUserDocument;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  kind: MeetingReactionKind;
}

export type MeetingChatReactionDocument = MeetingChatReaction & Document;

export const MeetingChatReactionSchema =
  SchemaFactory.createForClass(MeetingChatReaction);
