import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

@Schema()
export class VerificationCode {
  @Prop({
    type: Date,
    required: true,
    default: Date.now,
  })
  generatedAt: number;

  @Prop({
    required: true,
  })
  value: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;
}

export type VerificationCodeDocument = VerificationCode & Document;

export const VerificationCodeSchema =
  SchemaFactory.createForClass(VerificationCode);
