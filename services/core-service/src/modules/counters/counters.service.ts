import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Counter, CounterDocument } from '../../schemas/counter.schema';

import { ITransactionSession } from '../../helpers/mongo/withTransaction';

import { ICounter } from 'shared-types';

@Injectable()
export class CountersService {
  constructor(
    @InjectModel(Counter.name)
    private counter: Model<CounterDocument>,
  ) {}

  async create(data: ICounter) {
    return this.counter.create(data);
  }

  async find({
    query,
    session,
  }: {
    query: FilterQuery<CounterDocument>;
    session: ITransactionSession;
  }) {
    return this.counter.find(query, {}, { session: session?.session }).exec();
  }

  async updateOne({
    query,
    data,
    session,
  }: {
    query: FilterQuery<CounterDocument>;
    data: UpdateQuery<Counter>;
    session: ITransactionSession;
    new?: boolean;
  }) {
    return this.counter
      .findOneAndUpdate(query, data, {
        new: true,
        session: session?.session,
      })
      .exec();
  }

  async exists(query: FilterQuery<CounterDocument>) {
    return this.counter.exists(query).exec();
  }
}
