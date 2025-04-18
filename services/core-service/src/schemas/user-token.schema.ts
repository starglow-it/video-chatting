import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserDocument } from './user.schema';
import { TokenTypes } from 'shared-types';

@Schema()
export class UserToken {
  @Prop({
    type: Date,
    required: true,
  })
  expiresAt: number;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    enum: Object.values(TokenTypes),
  })
  type: TokenTypes;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  token: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: UserDocument;
}

export type UserTokenDocument = UserToken & Document;

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
