import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// schemas
import {
  CommonTemplate,
  CommonTemplateDocument,
} from '../schemas/common-template.schema';

// helpers
import { ITransactionSession } from '../helpers/mongo/withTransaction';

// types
import { ICommonTemplate } from '@shared/interfaces/common-template.interface';
import { CustomPopulateOptions } from '../types/custom';

@Injectable()
export class CommonTemplatesService {
  constructor(
    @InjectModel(CommonTemplate.name)
    private commonTemplate: Model<CommonTemplateDocument>,
  ) {}

  async exists(query: FilterQuery<CommonTemplateDocument>) {
    return this.commonTemplate.exists(query);
  }

  async findCommonTemplates({
    query,
    options,
    populatePaths,
    session,
  }: {
    query: FilterQuery<CommonTemplateDocument>;
    options?: { skip?: number; limit?: number };
    populatePaths?: CustomPopulateOptions;
    session?: ITransactionSession;
  }) {
    return this.commonTemplate
      .find(
        query,
        {},
        {
          populate: populatePaths,
          limit: options?.limit,
          skip: options?.skip,
          session: session?.session,
        },
      )
      .exec();
  }

  async findCommonTemplateById({
    templateId,
    session,
    populatePaths,
  }: {
    templateId: string;
    session: ITransactionSession;
    populatePaths?: CustomPopulateOptions;
  }) {
    return this.commonTemplate
      .findById(
        templateId,
        {},
        { populate: populatePaths, session: session?.session },
      )
      .exec();
  }

  async findCommonTemplate({
    query,
    session,
    populatePaths,
  }: {
    query: FilterQuery<CommonTemplateDocument>;
    session?: ITransactionSession;
    populatePaths?: CustomPopulateOptions;
  }) {
    return this.commonTemplate
      .findOne(
        query,
        {},
        { session: session?.session, populate: populatePaths },
      )
      .exec();
  }

  async createCommonTemplate(data: ICommonTemplate) {
    return this.commonTemplate.create(data);
  }

  async countCommonTemplates() {
    return this.commonTemplate.count();
  }

  async updateCommonTemplate({
    query,
    data,
    session,
    populatePaths,
  }: {
    query: FilterQuery<CommonTemplateDocument>;
    data: UpdateQuery<CommonTemplateDocument>;
    session?: ITransactionSession;
    populatePaths?: QueryOptions['populate'];
  }) {
    const options: QueryOptions = {
      session: session?.session,
      populate: populatePaths,
      new: true,
    };

    return this.commonTemplate.updateOne(query, data, options);
  }
}
