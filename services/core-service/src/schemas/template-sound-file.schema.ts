import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class TemplateSoundFile {
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
    type: mongoose.Schema.Types.String,
    required: true,
  })
  uploadKey: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  fileName: string;

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
}

export type TemplateSoundFileDocument = TemplateSoundFile & Document;

export const TemplateSoundFileSchema =
  SchemaFactory.createForClass(TemplateSoundFile);
