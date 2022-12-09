import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Counter, CounterDocument } from '../../schemas/counter.schema';

import { ICounter } from 'shared-types';
import { GetModelQuery, UpdateModelQuery } from '../../types/custom';

@Injectable()
export class CountersService {
  constructor(
    @InjectModel(Counter.name)
    private counter: Model<CounterDocument>,
  ) {}

  async create(data: ICounter) {
    return this.counter.create(data);
  }

  async find({ query, session }: GetModelQuery<CounterDocument>) {
    return this.counter.find(query, {}, { session: session?.session }).exec();
  }

  async updateOne({
    query,
    data,
    session,
  }: UpdateModelQuery<CounterDocument, Counter>) {
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
