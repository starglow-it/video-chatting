import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';

import {
  BusinessCategory,
  BusinessCategoryDocument,
} from '../../schemas/business-category.schema';

import { IBusinessCategory, IBusinessMedia } from 'shared-types';

import { GetModelQuery, UpdateModelQuery } from '../../types/custom';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { BusinessMedia, BusinessMediaDocument } from 'src/schemas/business-media.schema';

@Injectable()
export class BusinessCategoriesService {
  constructor(
    @InjectModel(BusinessCategory.name)
    private businessCategory: Model<BusinessCategoryDocument>,
    @InjectModel(BusinessMedia.name)
    private businessMedia: Model<BusinessMediaDocument>
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

  async createBusinessMedia({
    data,
    session,
  }: {
    data: Partial<BusinessMediaDocument>;
    session?: ITransactionSession;
  }): Promise<BusinessMediaDocument> {
    const [newMedia] = await this.businessMedia.create([data], {
      session: session?.session,
    });

    return newMedia;
  }

  async find({
    query,
    options,
    session,
  }: GetModelQuery<BusinessCategoryDocument>) {
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

  async findBusinessMedias({
    query,
    options,
    session,
    populatePaths
  }: GetModelQuery<BusinessMediaDocument>) {
    return this.businessMedia
      .find(
        query,
        {},
        {
          skip: options?.skip,
          limit: options?.limit,
          session: session?.session,
          populate: populatePaths
        },
      )
      .exec();
  }

  async findBusinessCategory({
    query,
    session,
    populatePaths,
  }: GetModelQuery<BusinessCategoryDocument>): Promise<BusinessCategoryDocument> {
    return this.businessCategory
      .findOne(query, {}, { session: session.session, populate: populatePaths })
      .exec();
  }

  async updateBusinessMedia({
    query,
    data,
    session,
    populatePaths,
  }: UpdateModelQuery<
    BusinessMediaDocument,
    BusinessMediaDocument
  >): Promise<any> {
    const options: QueryOptions = {
      session: session?.session,
      populate: populatePaths,
      new: true,
    };

    return this.businessMedia.findOneAndUpdate(query, data, options);
  }



  async exists(query: FilterQuery<BusinessCategoryDocument>): Promise<boolean> {
    const existedDocument = await this.businessCategory.exists(query).exec();

    return Boolean(existedDocument?._id);
  }

  async count(query: FilterQuery<BusinessCategoryDocument>): Promise<number> {
    return this.businessCategory.count(query).exec();
  }

  async countBusinessMedia(query: FilterQuery<BusinessMediaDocument>): Promise<number> {
    return this.businessMedia.count(query).exec();
  }
}
