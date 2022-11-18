import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  UserProfileStatistic,
  UserProfileStatisticDocument,
} from '../../schemas/user-profile-statistic.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { GetModelQuery, UpdateModelQuery } from '../../types/custom';

@Injectable()
export class UserProfileStatisticService {
  constructor(
    @InjectModel(UserProfileStatistic.name)
    private userProfileStatistic: Model<UserProfileStatisticDocument>,
  ) {}

  async create({
    data,
    session,
  }: {
    data: any;
    session?: ITransactionSession;
  }) {
    return this.userProfileStatistic.create([data], {
      session: session?.session,
    });
  }

  async find({
    query,
    options,
    session,
  }: GetModelQuery<UserProfileStatisticDocument>) {
    return this.userProfileStatistic
      .find(
        query,
        {},
        {
          skip: options?.skip,
          limit: options?.limit,
          session: session?.session,
        },
      )
      .exec();
  }

  async updateOne({
    query,
    data,
    session,
  }: UpdateModelQuery<UserProfileStatisticDocument, UserProfileStatistic>) {
    return this.userProfileStatistic
      .findOneAndUpdate(query, data, {
        new: true,
        session: session?.session,
      })
      .exec();
  }
}
