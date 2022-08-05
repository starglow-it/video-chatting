import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { BusinessCategoryDocument } from './business-category.schema';
import { PreviewImageDocument } from './preview-image.schema';

@Schema()
export class CommonTemplate {
  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
  })
  templateId: number;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  url: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
  })
  maxParticipants: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BusinessCategory' }],
  })
  businessCategories: BusinessCategoryDocument[];

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  description: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PreviewImage' }],
    required: true,
  })
  previewUrls: PreviewImageDocument[];

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    default: 'free',
  })
  type: string;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
  })
  isAudioAvailable: boolean;

  @Prop({
    type: [
      {
        bottom: mongoose.Schema.Types.Number,
        left: mongoose.Schema.Types.Number,
      },
    ],
    required: true,
  })
  usersPosition: { bottom: number; left: number }[];

  @Prop({
    type: [
      {
        item: mongoose.Schema.Types.String,
        position: {
          top: mongoose.Schema.Types.Number,
          left: mongoose.Schema.Types.Number,
        },
      },
    ],
  })
  links: { item: string; position: { top: number; left: number } }[];
}

export type CommonTemplateDocument = CommonTemplate & Document;

export const CommonTemplateSchema =
  SchemaFactory.createForClass(CommonTemplate);
