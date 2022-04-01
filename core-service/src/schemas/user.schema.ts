import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserTokenDocument } from './user-token.schema';
import * as mongoose from 'mongoose';
import { BusinessCategoryDocument } from './business-category.schema';
import { LanguageDocument } from './language.schema';
import { SocialLinkDocument } from './social-link.schema';
import { UserTemplateDocument } from './user-template.schema';
import { ProfileAvatarDocument } from './profile-avatar.schema';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  id: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  password: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  fullName: string;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  isConfirmed: boolean;

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
  description: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: '',
  })
  contactEmail: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BusinessCategory' }],
  })
  businessCategories: BusinessCategoryDocument[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
  })
  languages: LanguageDocument[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SocialLink' }],
  })
  socials: SocialLinkDocument[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserTemplate' }],
  })
  templates: UserTemplateDocument[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserToken' }],
  })
  tokens: UserTokenDocument[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProfileAvatar',
  })
  profileAvatar: ProfileAvatarDocument;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
