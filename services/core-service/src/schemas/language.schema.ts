import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Language {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  id: string;

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
}

export type LanguageDocument = Language & Document;

export const LanguageSchema = SchemaFactory.createForClass(Language);
