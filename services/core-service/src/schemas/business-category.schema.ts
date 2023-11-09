import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { BusinessCategoryTypeEnum } from 'shared-types';

@Schema()
export class BusinessCategory {
  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
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
  color: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: '1f527',
  })
  icon: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: BusinessCategoryTypeEnum.CanUpdate,
  })
  type: BusinessCategoryTypeEnum;
}

export type BusinessCategoryDocument = BusinessCategory & Document;

export const BusinessCategorySchema =
  SchemaFactory.createForClass(BusinessCategory);
