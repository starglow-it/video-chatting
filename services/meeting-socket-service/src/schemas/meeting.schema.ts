import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { MeetingUserDocument } from './meeting-user.schema';
import { DEFAULT_MEETING_VOLUME } from 'shared-const';
import { meetingLink } from 'shared-types';

@Schema()
export class Meeting {
  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false,
  })
  isMonetizationEnabled: boolean;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: 'together',
  })
  mode: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MeetingUser',
  })
  owner: MeetingUserDocument;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.String,
  })
  ownerProfileId: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.String,
  })
  templateId: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  sharingUserId: string;

  @Prop({
    type: mongoose.Schema.Types.Number,
  })
  maxParticipants: number;

  @Prop({
    type: mongoose.Schema.Types.Number,
  })
  endsAt: number;

  @Prop({
    type: mongoose.Schema.Types.Number,
  })
  startAt: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MeetingUser',
  })
  hostUserId: MeetingUserDocument;

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: DEFAULT_MEETING_VOLUME,
  })
  volume: number;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: true,
  })
  isMute: boolean;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: true,
  })
  isBlockAudiences: boolean;

  @Prop({
    type: [
      {
        url: mongoose.Schema.Types.String,
        users: [mongoose.Schema.Types.ObjectId]
      }
    ]
  })
  links: meetingLink[];

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 0,
  })
  entryFees: number;

  @Prop({
    type: mongoose.Schema.Types.Number,
    default: 0,
  })
  donations: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MeetingUser' }],
  })
  users: MeetingUserDocument[];

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false
  })
  isMeetingRecordingByRequest: boolean

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: false
  })
  isMeetingRecording: boolean

  @Prop({
    type: mongoose.Schema.Types.String,
    default: ''
  })
  recordingUrl: string
}

export type MeetingDocument = Meeting & Document;

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
