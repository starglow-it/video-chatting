import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { ICountryStatistic, QueryParams } from 'shared-types';

import {
  CountryStatistic,
  CountryStatisticDocument,
} from '../../schemas/country-statistic.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';

@Injectable()
export class CountryStatisticsService {
  constructor(
    @InjectModel(CountryStatistic.name)
    private countryStatistic: Model<CountryStatisticDocument>,
  ) {}

  async create({
    data,
    session,
  }: {
    data: ICountryStatistic;
    session: ITransactionSession;
  }) {
    return this.countryStatistic.create([data], { session: session?.session });
  }

  async find({
    query,
    options,
    session,
  }: {
    query: FilterQuery<CountryStatisticDocument>;
    session?: ITransactionSession;
    options?: QueryParams;
  }) {
    return this.countryStatistic
      .find(
        query,
        {},
        {
          skip: options?.skip,
          limit: options?.limit,
          session: session?.session,
          sort: options?.sort,
        },
      )
      .exec();
  }

  async updateOne({
    query,
    data,
    session,
  }: {
    query: FilterQuery<CountryStatisticDocument>;
    data: UpdateQuery<CountryStatistic>;
    session: ITransactionSession;
    new?: boolean;
  }) {
    return this.countryStatistic
      .findOneAndUpdate(query, data, {
        new: true,
        session: session?.session,
      })
      .exec();
  }

  async exists(query: FilterQuery<CountryStatisticDocument>) {
    return this.countryStatistic.exists(query).exec();
  }

  async count(query: FilterQuery<CountryStatisticDocument>): Promise<number> {
    return this.countryStatistic.count(query).exec();
  }
}
