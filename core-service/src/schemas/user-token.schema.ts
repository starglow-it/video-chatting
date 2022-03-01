import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

@Schema()
export class UserToken {
  @Prop({
    type: Date,
    required: true,
  })
  expiresAt: number;

  @Prop({
    type: String,
    required: true,
    enum: ['confirm', 'reset', 'access', 'refresh'],
  })
  type: string;

  @Prop({
    required: true,
  })
  token: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;
}

export type UserTokenDocument = UserToken & Document;

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
