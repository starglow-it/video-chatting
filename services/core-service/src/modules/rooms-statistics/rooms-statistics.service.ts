import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import {
  RoomStatistic,
  RoomStatisticDocument,
} from '../../schemas/room-statistic.schema';
import { GetModelMultipleQuery, UpdateModelSingleQuery } from '../../types/custom';

@Injectable()
export class RoomsStatisticsService {
  constructor(
    @InjectModel(RoomStatistic.name)
    private roomStatistic: Model<RoomStatisticDocument>,
  ) {}

  async create({
    data,
    session,
  }: {
    data: any;
    session?: ITransactionSession;
  }) {
    return this.roomStatistic.create([data], { session: session?.session });
  }

  async find({
    query,
    options,
    session,
  }: GetModelMultipleQuery<RoomStatisticDocument>) {
    return this.roomStatistic
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
  }: UpdateModelSingleQuery<RoomStatisticDocument>) {
    return this.roomStatistic
      .findOneAndUpdate(query, data, {
        new: true,
        session: session?.session,
      })
      .exec();
  }

async exists({ query }: { query: FilterQuery<RoomStatisticDocument> }) {
  return this.roomStatistic.exists(query);
}

  async count(query: FilterQuery<RoomStatisticDocument>): Promise<number> {
    return this.roomStatistic.count(query).exec();
  }

  async aggregate(aggregate) {
    return this.roomStatistic.aggregate(aggregate).exec();
  }

  async delete({ query, session }): Promise<void> {
    await this.roomStatistic
      .deleteOne(query, { session: session?.session })
      .exec();

    return;
  }
}
