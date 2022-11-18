import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  MonetizationStatistic,
  MonetizationStatisticDocument,
} from '../../schemas/monetization-statistic.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { GetModelQuery, UpdateModelQuery } from '../../types/custom';

@Injectable()
export class MonetizationStatisticService {
  constructor(
    @InjectModel(MonetizationStatistic.name)
    private monetizationStatistic: Model<MonetizationStatisticDocument>,
  ) {}

  async create({
    data,
    session,
  }: {
    data: any;
    session?: ITransactionSession;
  }) {
    return this.monetizationStatistic.create([data], {
      session: session?.session,
    });
  }

  async updateOne({
    query,
    data,
    session,
  }: UpdateModelQuery<MonetizationStatisticDocument, MonetizationStatistic>) {
    return this.monetizationStatistic
      .findOneAndUpdate(query, data, {
        new: true,
        session: session?.session,
      })
      .exec();
  }

  async find({
    query,
    options,
    session,
  }: GetModelQuery<MonetizationStatisticDocument>) {
    return this.monetizationStatistic
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

  async exists({ query }: GetModelQuery<MonetizationStatisticDocument>) {
    return this.monetizationStatistic.exists(query).exec();
  }

  async count(
    query: GetModelQuery<MonetizationStatisticDocument>['query'],
  ): Promise<number> {
    return this.monetizationStatistic.count(query).exec();
  }
}
