import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IPreviewImage } from 'shared-types';

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
  url: IPreviewImage['url'];

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
  })
  size: IPreviewImage['size'];

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  mimeType: IPreviewImage['mimeType'];

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  key: IPreviewImage['key'];

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
  })
  resolution: IPreviewImage['resolution'];
}

export type PreviewImageDocument = PreviewImage & Document;

export const PreviewImageSchema = SchemaFactory.createForClass(PreviewImage);
