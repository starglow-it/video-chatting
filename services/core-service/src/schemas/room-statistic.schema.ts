import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

// shared
import { UserDocument } from './user.schema';
import { UserTemplateDocument } from './user-template.schema';

@Schema()
export class RoomStatistic {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserTemplate',
    required: true,
  })
  template: UserTemplateDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0,
  })
  transactions: number;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0,
  })
  minutes: number;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0,
  })
  calls: number;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0,
  })
  money: number;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0,
  })
  uniqueUsers: number;
}

export type RoomStatisticDocument = RoomStatistic & Document;

export const RoomStatisticSchema = SchemaFactory.createForClass(RoomStatistic);
