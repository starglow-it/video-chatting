import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class ProfileAvatar {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  id: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  url: string;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
  })
  size: number;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  mimeType: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  key: string;
}

export type ProfileAvatarDocument = ProfileAvatar & Document;

export const ProfileAvatarSchema = SchemaFactory.createForClass(ProfileAvatar);
