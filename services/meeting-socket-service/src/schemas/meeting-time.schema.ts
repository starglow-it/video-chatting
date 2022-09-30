import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { MeetingUserDocument } from './meeting-user.schema';
import { MeetingDocument } from './meeting.schema';

@Schema()
export class MeetingHostTime {
  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
    default: Date.now,
  })
  startAt: number;

  @Prop({
    type: mongoose.Schema.Types.Number,
  })
  endAt: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MeetingUser',
  })
  host: MeetingUserDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
  })
  meeting: MeetingDocument;
}

export type MeetingHostTimeDocument = MeetingHostTime & Document;

export const MeetingHostTimeSchema =
  SchemaFactory.createForClass(MeetingHostTime);
