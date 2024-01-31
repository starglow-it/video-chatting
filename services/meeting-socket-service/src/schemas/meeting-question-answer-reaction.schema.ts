import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { MeetingUserDocument } from './meeting-user.schema';
import { MeetingQuestionAnswerDocument } from './meeting-question-answer.schema';
import { MeetingReactionKind } from 'shared-types';
import { MeetingDocument } from './meeting.schema';

@Schema()
export class MeetingQuestionAnswerReaction {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MeetingQuestionAnswer',
  })
  meetingQuestionAnswer: MeetingQuestionAnswerDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MeetingUser',
  })
  user: MeetingUserDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
  })
  meeting: MeetingDocument;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  kind: MeetingReactionKind;
}

export type MeetingQuestionAnswerReactionDocument = MeetingQuestionAnswerReaction & Document;

export const MeetingQuestionAnswerReactionSchema =
  SchemaFactory.createForClass(MeetingQuestionAnswerReaction);
