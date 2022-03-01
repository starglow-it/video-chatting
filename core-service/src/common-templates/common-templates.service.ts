import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
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

@Injectable()
export class CommonTemplatesService {
  constructor(
    @InjectModel(CommonTemplate.name)
    private commonTemplate: Model<CommonTemplateDocument>,
  ) {}

  async exists(query: FilterQuery<CommonTemplateDocument>): Promise<boolean> {
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
    populatePaths?: string | string[] | PopulateOptions | PopulateOptions[];
    session?: ITransactionSession;
  }): Promise<CommonTemplateDocument[]> {
    return this.commonTemplate.find(
      query,
      {},
      {
        populate: populatePaths,
        limit: options?.limit,
        skip: options?.skip,
        session: session?.session,
      },
    );
  }

  async findCommonTemplateById({
    templateId,
    session,
    populatePaths,
  }: {
    templateId: string;
    session: ITransactionSession;
    populatePaths?: string | string[] | PopulateOptions | PopulateOptions[];
  }): Promise<CommonTemplateDocument> {
    return this.commonTemplate.findById(
      templateId,
      {},
      { populate: populatePaths, session: session?.session },
    );
  }

  async findCommonTemplate(
    query: FilterQuery<CommonTemplateDocument>,
    session: ITransactionSession,
  ) {
    return this.commonTemplate.findOne(
      query,
      {},
      { session: session?.session },
    );
  }

  async createCommonTemplate(
    data: ICommonTemplate,
  ): Promise<CommonTemplateDocument> {
    return this.commonTemplate.create(data);
  }

  async countCommonTemplates(): Promise<number> {
    return this.commonTemplate.count();
  }
}
