import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserDocument } from './user.schema';
import {
  DashboardNotificationReadStatus,
  DashboardNotificationTypes,
} from 'shared-types';
import { UserTemplateDocument } from './user-template.schema';

@Schema()
export class DashboardNotification {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserTemplate',
    required: true,
  })
  template: UserTemplateDocument;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
  })
  notificationType: DashboardNotificationTypes;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
  })
  sentAt: number;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
    default: DashboardNotificationReadStatus.active,
  })
  status: DashboardNotificationReadStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  sender: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  receiver: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
  })
  isSenderGuest: boolean;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  senderFullName: string;
}

export type DashboardNotificationDocument = DashboardNotification & Document;

export const DashboardNotificationSchema = SchemaFactory.createForClass(
  DashboardNotification,
);
