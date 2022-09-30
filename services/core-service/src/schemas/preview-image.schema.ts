import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class PreviewImage {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  id: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  url: string;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
  })
  size: number;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  mimeType: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  key: string;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
  })
  resolution: number;
}

export type PreviewImageDocument = PreviewImage & Document;

export const PreviewImageSchema = SchemaFactory.createForClass(PreviewImage);
