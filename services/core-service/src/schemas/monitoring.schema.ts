import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
export class Monitoring {
  @Prop({
    type: mongoose.Schema.Types.String,
    required: true
  })
  event: string;

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 0
  })
  processTime: number;

  @Prop({
    type: mongoose.Schema.Types.Date,
    default: new Date(),
    required: false
  })
  createdAt?: Date;

  @Prop({
    type: mongoose.Schema.Types.Date,
    default: new Date(),
    required: false
  })
  updatedAt?: Date;

}

export type MonitoringDocument = Monitoring & Document;

export const MonitoringSchema =
  SchemaFactory.createForClass(Monitoring);
