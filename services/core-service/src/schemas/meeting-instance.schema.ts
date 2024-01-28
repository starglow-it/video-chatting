import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserDocument } from './user.schema';
import { IMeetingInstance } from 'shared-types';

@Schema()
export class MeetingInstance {
  @Prop({
    type: mongoose.Schema.Types.String,
  })
  serverIp: IMeetingInstance['serverIp'];

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  instanceId: IMeetingInstance['instanceId'];

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  snapshotId: IMeetingInstance['snapshotId'];

  @Prop({
    type: mongoose.Schema.Types.String,
    default: 'inactive',
  })
  serverStatus: IMeetingInstance['serverStatus'];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  startAt: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  aboutTheHost: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  content: string;
}

export type MeetingInstanceDocument = MeetingInstance & Document;

export const MeetingInstanceSchema =
  SchemaFactory.createForClass(MeetingInstance);
