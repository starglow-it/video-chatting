import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { ICounter } from 'shared-types';

import { Counter, CounterDocument } from '../../schemas/counter.schema';

import { GetModelMultipleQuery, UpdateModelSingleQuery } from '../../types/custom';

import { ITransactionSession } from '../../helpers/mongo/withTransaction';

@Injectable()
export class CountersService {
  constructor(
    @InjectModel(Counter.name)
    private counter: Model<CounterDocument>,
  ) {}

  async create({
    data,
    session,
  }: {
    data: ICounter;
    session?: ITransactionSession;
  }): Promise<CounterDocument> {
    const [newCounter] = await this.counter.create([data], {
      session: session?.session,
    });

    return newCounter;
  }

  async find({
    query,
    session,
  }: GetModelMultipleQuery<CounterDocument>): Promise<CounterDocument[]> {
    return this.counter.find(query, {}, { session: session?.session }).exec();
  }

  async updateOne({
    query,
    data,
    session,
  }: UpdateModelSingleQuery<CounterDocument>) {
    return this.counter
      .findOneAndUpdate(query, data, {
        new: true,
        session: session?.session,
      })
      .exec();
  }

  async exists(query: FilterQuery<CounterDocument>): Promise<boolean> {
    const counter = await this.counter.exists(query).exec();

    return Boolean(counter?._id);
  }
}
