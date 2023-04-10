import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class MediaCategory {
  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  key: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  value: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  emojiUrl: string;
}

export type MediaCategoryDocument = MediaCategory & Document;

export const MediaCategorySchema =
  SchemaFactory.createForClass(MediaCategory);
