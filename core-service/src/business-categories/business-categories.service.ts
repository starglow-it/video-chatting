import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import {
  BusinessCategory,
  BusinessCategoryDocument,
} from '../schemas/business-category.schema';

import { IBusinessCategory } from '@shared/interfaces/business-category.interface';

import { ITransactionSession } from '../helpers/mongo/withTransaction';

@Injectable()
export class BusinessCategoriesService {
  constructor(
    @InjectModel(BusinessCategory.name)
    private businessCategory: Model<BusinessCategoryDocument>,
  ) {}

  async create(data: IBusinessCategory) {
    return await this.businessCategory.create(data);
  }

  async find(
    query: FilterQuery<BusinessCategoryDocument>,
    session?: ITransactionSession,
  ): Promise<BusinessCategoryDocument[]> {
    if (session) {
      return this.businessCategory.find(
        query,
        {},
        { session: session?.session },
      );
    }
    return this.businessCategory.find(query);
  }

  async exists(query: FilterQuery<BusinessCategoryDocument>): Promise<boolean> {
    return this.businessCategory.exists(query);
  }
}
