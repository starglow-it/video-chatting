import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { PreviewImageDocument } from './preview-image.schema';

@Schema()
export class Resouce {
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
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PreviewImage' }],
    required: true,
  })
  previewUrls: PreviewImageDocument[];

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
}

export type ResouceDocument = Resouce & Document;

export const ResouceSchema = SchemaFactory.createForClass(Resouce);
