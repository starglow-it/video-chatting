import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { MeetingUserDocument } from './meeting-user.schema';
import { MeetingChatDocument } from './meeting-chat.schema';
import { MeetingReactionKind } from 'shared-types';
import { MeetingDocument } from './meeting.schema';

@Schema()
export class MeetingChatReaction {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MeetingChat',
  })
  meetingChat: MeetingChatDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MeetingUser',
  })
  user: MeetingUserDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
  })
  meeting: MeetingDocument;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  kind: MeetingReactionKind;
}

export type MeetingChatReactionDocument = MeetingChatReaction & Document;

export const MeetingChatReactionSchema =
  SchemaFactory.createForClass(MeetingChatReaction);
