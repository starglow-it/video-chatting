import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { MeetingDocument } from './meeting.schema';

@Schema({
  timestamps: true
})
export class MeetingRecord {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
  })
  meetingId: MeetingDocument;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: ''
  })
  url: string;
}

export type MeetingRecordDocument = MeetingRecord & Document;

export const MeetingRecordSchema = SchemaFactory.createForClass(MeetingRecord);
