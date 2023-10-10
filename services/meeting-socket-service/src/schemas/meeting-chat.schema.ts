import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { MeetingUser, MeetingUserDocument } from './meeting-user.schema';
import { MeetingReactionKind } from 'shared-types';
import { Meeting, MeetingDocument } from './meeting.schema';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
  },
})
export class MeetingChat {
  @Prop({
    type: mongoose.Schema.Types.String,
    required: true
  })
  body: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: MeetingUser.name,
  })
  sender: MeetingUserDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Meeting.name,
  })
  meeting: MeetingDocument;

  @Prop({
    type: mongoose.Schema.Types.Map,
    of: Number,
    default: new Map<MeetingReactionKind, number>(),
  })
  reactionsCount: Map<MeetingReactionKind, number>;

  createdAt?: Date;
}

export type MeetingChatDocument = MeetingChat & Document;

export const MeetingChatSchema = SchemaFactory.createForClass(MeetingChat);
