import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { MeetingUserDocument } from './meeting-user.schema';
import { MeetingDocument } from './meeting.schema';

@Schema()
export class MeetingReaction {
  @Prop({
    type: mongoose.Schema.Types.String,
    default: false,
  })
  emojiName: string;

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
}

export type MeetingReactionDocument = MeetingReaction & Document;

export const MeetingReactionSchema = SchemaFactory.createForClass(MeetingReaction);
