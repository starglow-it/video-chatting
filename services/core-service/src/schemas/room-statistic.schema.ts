import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, Document } from 'mongoose';
import * as mongoose from 'mongoose';
import * as moment from 'moment-timezone';

// shared
import { UserDocument } from './user.schema';
import { UserTemplateDocument } from './user-template.schema';

@Schema({ timestamps: true })
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
  })
  author: UserDocument;

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

  updatedAt?: string;
}

export type RoomStatisticDocument = RoomStatistic & Document;

export const RoomStatisticSchema = SchemaFactory.createForClass(RoomStatistic);

// Middleware to set the updatedAt field with timezone
RoomStatisticSchema.pre<RoomStatisticDocument>('save', function (next) {
  const currentDateTime = moment(); // Get the current date and time
  const timezone = 'America/Los_Angeles'; // Replace with the desired timezone

  // Use moment-timezone to convert the date to the specified timezone
  this.updatedAt = currentDateTime.tz(timezone).format('MM DD, YY, hh:mm A, z');

  next();
});
