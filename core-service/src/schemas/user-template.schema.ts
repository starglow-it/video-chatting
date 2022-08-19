import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { BusinessCategoryDocument } from './business-category.schema';
import { UserDocument } from './user.schema';
import { LanguageDocument } from './language.schema';
import { SocialLinkDocument } from './social-link.schema';
import { MeetingInstanceDocument } from './meeting-instance.schema';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { PreviewImageDocument } from './preview-image.schema';

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
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinessCategory',
      },
    ],
  })
  businessCategories: BusinessCategoryDocument[];

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    default: 'Dumb description',
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
  signBoard: ICommonUserDTO['signBoard'];

  @Prop({
    type: mongoose.Schema.Types.String,
    default: '',
  })
  customLink: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: 'USD',
  })
  templateCurrency: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: '',
  })
  templatePrice: number;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  isMonetizationEnabled: boolean;

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

export type UserTemplateDocument = UserTemplate & Document;

export const UserTemplateSchema = SchemaFactory.createForClass(UserTemplate);
