import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserDocument } from './user.schema';
import { UserTemplateDocument } from './user-template.schema';

@Schema()
export class MeetingInstance {
  @Prop({
    type: mongoose.Schema.Types.String,
  })
  serverIp: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  meetingToken: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserTemplate',
  })
  template: UserTemplateDocument;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: UserDocument;

  @Prop({
    type: String,
  })
  serverStatus: string;
}

export type MeetingInstanceDocument = MeetingInstance & Document;

export const MeetingInstanceSchema =
  SchemaFactory.createForClass(MeetingInstance);
