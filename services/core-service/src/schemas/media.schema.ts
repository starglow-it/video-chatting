import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { PreviewImageDocument } from './preview-image.schema';
import { MediaCategory, MediaCategoryDocument } from './media-category.schema';

@Schema()
export class Media {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: MediaCategory.name
  })
  mediaCategory: MediaCategoryDocument;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  url: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PreviewImage' }],
    required: true,
  })
  previewUrls: PreviewImageDocument[];

  @Prop({
    type: mongoose.Schema.Types.String
  })
  type: string;

}

export type MediaDocument = Media & Document;

export const MediaSchema =
  SchemaFactory.createForClass(Media);
