import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Resouce, ResouceDocument, ResouceSchema } from './resouce.schema';
import { Type } from 'class-transformer';

@Schema()
export class MeetingAvatar {
  @Prop({
    type: ResouceSchema,
  })
  @Type(() => Resouce)
  resouce: ResouceDocument;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  status: string;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.String,
      },
    ],
  })
  roles: string[];
}

export type MeetingAvatarDocument = MeetingAvatar & mongoose.Document;

export const MeetingAvatarSchema = SchemaFactory.createForClass(MeetingAvatar);
