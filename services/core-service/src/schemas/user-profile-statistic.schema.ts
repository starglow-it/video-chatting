import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

// shared
import { UserDocument } from './user.schema';
import { ICommonUserStatistic } from 'shared-types';

@Schema()
export class UserProfileStatistic {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0,
  })
  minutesSpent: ICommonUserStatistic['minutesSpent'];

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0,
  })
  roomsUsed: ICommonUserStatistic['roomsUsed'];

  @Prop({
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0,
  })
  moneyEarned: ICommonUserStatistic['moneyEarned'];
}

export type UserProfileStatisticDocument = UserProfileStatistic & Document;

export const UserProfileStatisticSchema =
  SchemaFactory.createForClass(UserProfileStatistic);
