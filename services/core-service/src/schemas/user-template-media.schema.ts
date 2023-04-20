import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { PreviewImageDocument } from './preview-image.schema';
import {UserTemplateDocument, UserTemplate} from './user-template.schema';
import { MediaCategory, MediaCategoryDocument } from './media-category.schema';

@Schema()
export class UserTemplateMedia {
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
    type: mongoose.Schema.Types.String,
    default: ''
  })
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PreviewImage' }],
    required: true,
  })
  previewUrls: PreviewImageDocument[];

  @Prop({
    type: mongoose.Schema.Types.String
  })
  type: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserTemplate.name
  })
  userTemplate: UserTemplateDocument

}

export type UserTemplateMediaDocument = UserTemplateMedia & Document;

export const UserTemplateMediaSchema =
  SchemaFactory.createForClass(UserTemplateMedia);
