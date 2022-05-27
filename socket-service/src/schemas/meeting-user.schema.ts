import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { MeetingDocument } from './meeting.schema';
import { AccessStatusEnum } from '../types/accessStatus.enum';

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
    default: AccessStatusEnum.EnterName,
    enum: [
      AccessStatusEnum.InMeeting,
      AccessStatusEnum.Waiting,
      AccessStatusEnum.Rejected,
      AccessStatusEnum.RequestSent,
      AccessStatusEnum.EnterName,
    ],
  })
  accessStatus: string;

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
    type: mongoose.Schema.Types.Number,
    required: true,
  })
  meetingUserId: number;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  profileAvatar: string;
}

export type MeetingUserDocument = MeetingUser & Document;

export const MeetingUserSchema = SchemaFactory.createForClass(MeetingUser);
