import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ICommonUser, RoomType, TemplateType } from 'shared-types';

import { BusinessCategoryDocument } from './business-category.schema';
import { UserDocument } from './user.schema';
import { LanguageDocument } from './language.schema';
import { SocialLinkDocument } from './social-link.schema';
import { PreviewImageDocument } from './preview-image.schema';
import { MeetingInstanceDocument } from './meeting-instance.schema';
import { MediaLink } from '../types/template';

@Schema()
export class UserTemplate {
  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
  })
  templateId: number;

  @Prop({
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  })
  usedAt: number;

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 0,
  })
  timesUsed: number;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  url: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  draftUrl: string;

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
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinessCategory',
      },
    ],
  })
  businessCategories: BusinessCategoryDocument[];

  @Prop({
    type: MediaLink,
    default: null,
  })
  mediaLink: MediaLink;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: '',
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
    required: true,
  })
  draftPreviewUrls: PreviewImageDocument[];

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    default: 'free',
  })
  type: string;

  @Prop({
    type: mongoose.Schema.Types.Number,
  })
  priceInCents: number;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  fullName: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: '',
  })
  companyName: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: '',
  })
  position: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: '',
  })
  contactEmail: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
  })
  languages: LanguageDocument[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SocialLink' }],
  })
  socials: SocialLinkDocument[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MeetingInstance',
  })
  meetingInstance: MeetingInstanceDocument;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    default: 'default',
  })
  signBoard: ICommonUser['signBoard'];

  @Prop({
    type: mongoose.Schema.Types.String,
    default: '',
  })
  customLink: string;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
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
    type: [mongoose.Schema.Types.Number],
    default: [],
  })
  usersSize: number[];

  @Prop({
    type: [mongoose.Schema.Types.String],
    default: [],
  })
  indexUsers: string[];

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
    type: mongoose.Schema.Types.String,
    required: true,
    default: 'video',
  })
  templateType: TemplateType;

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

export type UserTemplateDocument = UserTemplate & Document;

export const UserTemplateSchema = SchemaFactory.createForClass(UserTemplate);
