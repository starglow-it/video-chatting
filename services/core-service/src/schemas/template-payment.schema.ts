import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

// shared
import { UserDocument } from './user.schema';
import { UserTemplateDocument } from './user-template.schema';
import {
  DEFAULT_PAYMENT_CURRENCY,
  PaymentType,
  StripeCurrency,
} from 'shared-const';
import { MeetingRole } from 'shared-types';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class TemplatePayment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserTemplate',
    required: true,
  })
  userTemplate: UserTemplateDocument;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
  })
  templateId: number;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  type: PaymentType;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 0,
  })
  price: number;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: DEFAULT_PAYMENT_CURRENCY,
  })
  currency: StripeCurrency;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  meetingRole: Exclude<MeetingRole, 'host' | 'recorder'>;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  enabled: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}

export type TemplatePaymentDocument = TemplatePayment & Document;

export const TemplatePaymentSchema =
  SchemaFactory.createForClass(TemplatePayment);
