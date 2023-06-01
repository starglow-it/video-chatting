import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { PreviewImageDocument } from './preview-image.schema';
import { User, UserDocument } from './user.schema';

@Schema()
export class FeaturedBackground {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: ''
  })
  url: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PreviewImage' }],
    required: true,
  })
  previewUrls: PreviewImageDocument[];

  @Prop({
    type: mongoose.Schema.Types.String,
    default: '',
  })
  type: string;

}

export type FeaturedBackgroundDocument = FeaturedBackground & Document;

export const FeaturedBackgroundSchema =
  SchemaFactory.createForClass(FeaturedBackground);
