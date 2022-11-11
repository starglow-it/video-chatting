import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import {
  MonetizationStatistic,
  MonetizationStatisticDocument,
} from '../../schemas/monetization-statistic.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { QueryParams } from 'shared-types';

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
  }: {
    query: FilterQuery<MonetizationStatisticDocument>;
    data: UpdateQuery<MonetizationStatistic>;
    session: ITransactionSession;
    new?: boolean;
  }) {
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
  }: {
    query: FilterQuery<MonetizationStatisticDocument>;
    session?: ITransactionSession;
    options?: QueryParams;
  }) {
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

  async exists({
    query,
  }: {
    query: FilterQuery<MonetizationStatisticDocument>;
  }) {
    return this.monetizationStatistic.exists(query);
  }

  async count(
    query: FilterQuery<MonetizationStatisticDocument>,
  ): Promise<number> {
    return this.monetizationStatistic.count(query).exec();
  }
}
