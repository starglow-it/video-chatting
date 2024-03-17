import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { MeetingDocument } from './meeting.schema';
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
import { MeetingChatDocument } from './meeting-chat.schema';

@Schema()
export class MeetingPrePaymentCode {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
  })
  meeting: MeetingDocument;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: ''
  })
  email: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  code: string;
}

export type MeetingPrePaymentCodeDocument = MeetingPrePaymentCode & Document;

export const MeetingPrePaymentCodeSchema = SchemaFactory.createForClass(MeetingPrePaymentCode);