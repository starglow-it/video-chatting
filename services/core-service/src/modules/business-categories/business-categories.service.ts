import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import {
  BusinessCategory,
  BusinessCategoryDocument,
} from '../../schemas/business-category.schema';

import { IBusinessCategory } from 'shared-types';

import {
  GetModelMultipleQuery,
  UpdateModelSingleQuery,
} from '../../types/custom';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';

@Injectable()
export class BusinessCategoriesService {
  constructor(
    @InjectModel(BusinessCategory.name)
    private businessCategory: Model<BusinessCategoryDocument>,
  ) {}

  async create({
    data,
    session,
  }: {
    data: IBusinessCategory;
    session?: ITransactionSession;
  }): Promise<BusinessCategoryDocument> {
    const [newTag] = await this.businessCategory.create([data], {
      session: session?.session,
    });

    return newTag;
  }

  async find({
    query,
    options,
    session,
  }: GetModelMultipleQuery<BusinessCategoryDocument>) {
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

  async findOneAndUpdate({
    query,
    data,
    session,
    populatePaths,
  }: UpdateModelSingleQuery<BusinessCategoryDocument>): Promise<BusinessCategoryDocument> {
    return this.businessCategory.findOneAndUpdate(query, data, {
      session: session?.session,
      populate: populatePaths,
      new: true,
    });
  }

  async deleteAll({
    query,
    session,
  }: {
    query: FilterQuery<BusinessCategoryDocument>;
    session?: ITransactionSession;
  }): Promise<any> {
    await this.businessCategory.deleteMany(query, {
      session: session?.session,
    });
  }
}
