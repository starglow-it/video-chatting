import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { MeetingDocument } from './meeting.schema';
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
import { MeetingChatDocument } from './meeting-chat.schema';

@Schema()
export class MeetingUser {
  @Prop({
    type: mongoose.Schema.Types.String,
  })
  profileId: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.String,
  })
  socketId: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  username: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: MeetingAccessStatusEnum.Initial,
    enum: Object.values(MeetingAccessStatusEnum),
  })
  accessStatus: string;

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: Date.now,
  })
  joinedAt: number;

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: Date.now,
  })
  leaveAt: number;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: 'inactive',
  })
  cameraStatus: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: 'inactive',
  })
  micStatus: string;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  isGenerated: boolean;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  isAuraActive: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
  })
  meeting: MeetingDocument;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  profileAvatar: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  meetingAvatarId: string;

  @Prop({
    type: {
      bottom: mongoose.Schema.Types.Number,
      left: mongoose.Schema.Types.Number,
    },
  })
  userPosition: { bottom: number; left: number };

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  avatarRole: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  meetingRole: MeetingRole;

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 0,
  })
  userSize: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MeetingChat',
    required: false,
  })
  lastOldMessage: MeetingChatDocument;

  @Prop({ default: Date.now })
  createdAt: number;

  @Prop({ default: Date.now })
  updatedAt: number;
}

export type MeetingUserDocument = MeetingUser & Document;

export const MeetingUserSchema = SchemaFactory.createForClass(MeetingUser);

MeetingUserSchema.pre('save', function (next) {
  const now = Date.now();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});
