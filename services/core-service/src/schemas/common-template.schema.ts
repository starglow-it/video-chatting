import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { BusinessCategoryDocument } from './business-category.schema';
import { PreviewImageDocument } from './preview-image.schema';
import { UserDocument } from './user.schema';
import { RoomType } from 'shared-types';

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
    default: '',
  })
  draftUrl: string;

  @Prop({
    type: mongoose.Schema.Types.String,
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
  })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  shortDescription: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PreviewImage' }],
    required: true,
  })
  previewUrls: PreviewImageDocument[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PreviewImage' }],
    default: [],
  })
  draftPreviewUrls: PreviewImageDocument[];

  @Prop({
    type: mongoose.Schema.Types.String,
    default: 'free',
  })
  type: string;

  @Prop({
    type: mongoose.Schema.Types.Number,
  })
  priceInCents: number;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
  })
  isAudioAvailable: boolean;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  stripeProductId: string;

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

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  author: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    required: true,
    default: false,
  })
  draft: boolean;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    required: true,
    default: true,
  })
  isPublic: boolean;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    default: 'video',
  })
  templateType: 'image' | 'video';

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  isAcceptNoLogin: boolean;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: RoomType.Normal,
  })
  roomType: RoomType;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: '',
    required: false,
  })
  subdomain: string;
}

export type CommonTemplateDocument = CommonTemplate & Document;

export const CommonTemplateSchema =
  SchemaFactory.createForClass(CommonTemplate);
