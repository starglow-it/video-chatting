import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import {
  BusinessCategory,
  BusinessCategoryDocument,
} from '../../schemas/business-category.schema';

import { IBusinessCategory } from 'shared-types';

import { ITransactionSession } from '../../helpers/mongo/withTransaction';

@Injectable()
export class BusinessCategoriesService {
  constructor(
    @InjectModel(BusinessCategory.name)
    private businessCategory: Model<BusinessCategoryDocument>,
  ) {}

  async create(data: IBusinessCategory) {
    return this.businessCategory.create(data);
  }

  async find({
    query,
    options,
    session,
  }: {
    query: FilterQuery<BusinessCategoryDocument>;
    session?: ITransactionSession;
    options?: { skip: number; limit: number };
  }) {
    return this.businessCategory
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

  async exists(query: FilterQuery<BusinessCategoryDocument>): Promise<boolean> {
    const existedDocument = await this.businessCategory.exists(query).exec();

    return Boolean(existedDocument?._id);
  }

  async count(query: FilterQuery<BusinessCategoryDocument>): Promise<number> {
    return this.businessCategory.count(query).exec();
  }
}
