import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { MeetingDocument } from './meeting.schema';

@Schema({})
export class MeetingDonations {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
  })
  meeting: MeetingDocument;

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 0
  })
  participantDonations: number;

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 0
  })
  audienceDonations: number;
}

export type MeetingDonationsDocument = MeetingDonations & Document;

export const MeetingDonationsSchema = SchemaFactory.createForClass(MeetingDonations);
