import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})
export class Monitoring {
  @Prop({
    type: mongoose.Schema.Types.String,
    required: true
  })
  event: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true
  })
  eventId: string;

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 0
  })
  processTime: number;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: {}
  })
  metadata: Object;

  createdAt?: Date;

  updatedAt?: Date;

}

export type MonitoringDocument = Monitoring & Document;

export const MonitoringSchema =
  SchemaFactory.createForClass(Monitoring);
