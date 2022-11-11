import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class MonetizationStatistic {
  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  key: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  type: string;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0,
  })
  value: number;
}

export type MonetizationStatisticDocument = MonetizationStatistic & Document;

export const MonetizationStatisticSchema = SchemaFactory.createForClass(
  MonetizationStatistic,
);
