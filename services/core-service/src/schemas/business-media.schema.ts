import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

// shared
import { UserDocument } from './user.schema';
import { ICommonUserStatistic } from 'shared-types';
import { PreviewImageDocument } from './preview-image.schema';
import { BusinessCategory, BusinessCategoryDocument } from './business-category.schema';

@Schema()
export class BusinessMedia {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: BusinessCategory.name
  })
  businessCategory: BusinessCategoryDocument;


  @Prop({
    type: mongoose.Schema.Types.String,
  })
  title: string;

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
  mediaType: string;

}

export type BusinessMediaDocument = BusinessMedia & Document;

export const BusinessMediaSchema =
  SchemaFactory.createForClass(BusinessMedia);
