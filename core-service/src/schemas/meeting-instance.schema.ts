import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserDocument } from './user.schema';

@Schema()
export class MeetingInstance {
  @Prop({
    type: mongoose.Schema.Types.String,
  })
  serverIp: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  serverStatus: string;
}

export type MeetingInstanceDocument = MeetingInstance & Document;

export const MeetingInstanceSchema =
  SchemaFactory.createForClass(MeetingInstance);
