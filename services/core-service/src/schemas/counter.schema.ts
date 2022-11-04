import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Counters } from 'shared-types';

@Schema()
export class Counter {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  id: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  key: Counters;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
  })
  value: number;
}

export type CounterDocument = Counter & Document;

export const CounterSchema = SchemaFactory.createForClass(Counter);
