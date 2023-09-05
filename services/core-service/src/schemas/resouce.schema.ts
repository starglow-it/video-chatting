import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { PreviewImageDocument } from './preview-image.schema';

@Schema()
export class Resouce {
  @Prop({
    type: mongoose.Schema.Types.String,
    default: '',
  })
  url: string;

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 0,
  })
  size: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PreviewImage' }],
    default: []
  })
  previewUrls: PreviewImageDocument[];

  @Prop({
    type: mongoose.Schema.Types.String,
    default: ''
  })
  mimeType: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: ''
  })
  key: string;
}

export type ResouceDocument = Resouce & Document;

export const ResouceSchema = SchemaFactory.createForClass(Resouce);
