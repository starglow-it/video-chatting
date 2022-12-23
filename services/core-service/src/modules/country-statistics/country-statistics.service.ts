import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ICountryStatistic } from 'shared-types';

import {
  CountryStatistic,
  CountryStatisticDocument,
} from '../../schemas/country-statistic.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { GetModelQuery, UpdateModelQuery } from '../../types/custom';

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
  }): Promise<CountryStatisticDocument> {
    const [newCountryStatistic] = await this.countryStatistic.create([data], {
      session: session?.session,
    });

    return newCountryStatistic;
  }

  async find({
    query,
    options,
    session,
  }: GetModelQuery<CountryStatisticDocument>) {
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
  }: UpdateModelQuery<
    CountryStatisticDocument,
    CountryStatistic
  >): Promise<CountryStatisticDocument> {
    return this.countryStatistic
      .findOneAndUpdate(query, data, {
        new: true,
        session: session?.session,
      })
      .exec();
  }

  async exists(query: FilterQuery<CountryStatisticDocument>): Promise<boolean> {
    const data = await this.countryStatistic.exists(query).exec();

    return Boolean(data?._id);
  }

  async count(query: FilterQuery<CountryStatisticDocument>): Promise<number> {
    return this.countryStatistic.count(query).exec();
  }
}
