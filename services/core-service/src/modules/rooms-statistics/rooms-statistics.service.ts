import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import {
  RoomStatistic,
  RoomStatisticDocument,
} from '../../schemas/room-statistic.schema';
import { QueryParams } from 'shared-types';

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
  }: {
    query: FilterQuery<RoomStatisticDocument>;
    session?: ITransactionSession;
    options?: QueryParams;
  }) {
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
  }: {
    query: FilterQuery<RoomStatisticDocument>;
    data: UpdateQuery<RoomStatistic>;
    session: ITransactionSession;
    new?: boolean;
  }) {
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
    await this.roomStatistic.deleteOne(query, { session: session?.session }).exec();

    return
  }
}
