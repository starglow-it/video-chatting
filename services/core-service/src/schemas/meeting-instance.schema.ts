import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserDocument } from './user.schema';
import { ICommonMeetingInstance } from '@shared/interfaces/common-instance-meeting.interface';

@Schema()
export class MeetingInstance {
  @Prop({
    type: mongoose.Schema.Types.String,
  })
  serverIp: ICommonMeetingInstance['serverIp'];

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  instanceId: ICommonMeetingInstance['instanceId'];

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  snapshotId: ICommonMeetingInstance['snapshotId'];

  @Prop({
    type: mongoose.Schema.Types.String,
    default: 'inactive',
  })
  serverStatus: ICommonMeetingInstance["serverStatus"];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: UserDocument;
}

export type MeetingInstanceDocument = MeetingInstance & Document;

export const MeetingInstanceSchema =
  SchemaFactory.createForClass(MeetingInstance);
