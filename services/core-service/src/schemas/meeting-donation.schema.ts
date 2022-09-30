import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserDocument } from './user.schema';

@Schema()
export class MeetingDonation {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  id: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  paymentIntentId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: UserDocument;
}

export type MeetingDonationDocument = MeetingDonation & Document;

export const MeetingDonationSchema =
  SchemaFactory.createForClass(MeetingDonation);
