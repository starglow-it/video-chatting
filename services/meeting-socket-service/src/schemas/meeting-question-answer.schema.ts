import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { MeetingUserDocument } from './meeting-user.schema';
import { MeetingReactionKind } from 'shared-types';
import { MeetingDocument } from './meeting.schema';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
  },
})
export class MeetingQuestionAnswer {
  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  body: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MeetingUser',
    required: true,
  })
  sender: MeetingUserDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MeetingUser',
  })
  meeting: MeetingDocument;

  @Prop({
    type: mongoose.Schema.Types.Map,
    of: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MeetingUser',
        },
      ],
    },
    default: new Map<MeetingReactionKind, MeetingUserDocument[]>(),
  })
  reactions: Map<MeetingReactionKind, MeetingUserDocument[]>;

  createdAt?: Date;
}

export type MeetingQuestionAnswerDocument = MeetingQuestionAnswer & Document;

export const MeetingQuestionAnswerSchema = SchemaFactory.createForClass(MeetingQuestionAnswer);
