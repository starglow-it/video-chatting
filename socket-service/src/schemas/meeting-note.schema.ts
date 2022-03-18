import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { MeetingUserDocument } from './meeting-user.schema';
import { MeetingDocument } from './meeting.schema';

@Schema()
export class MeetingNote {
  @Prop({
    type: mongoose.Schema.Types.String,
    default: false,
  })
  content: string;

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

export type MeetingNoteDocument = MeetingNote & Document;

export const MeetingNoteSchema = SchemaFactory.createForClass(MeetingNote);
