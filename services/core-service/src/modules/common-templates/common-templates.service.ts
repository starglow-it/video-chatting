import { Injectable } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  PipelineStage,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// schemas
import {
  CommonTemplate,
  CommonTemplateDocument,
} from '../../schemas/common-template.schema';
import {
  PreviewImage,
  PreviewImageDocument,
} from '../../schemas/preview-image.schema';

// services
import { AwsConnectorService } from '../../services/aws-connector/aws-connector.service';
import { CountersService } from '../counters/counters.service';

// const
import { Counters } from 'shared-types';

// helpers
import { ITransactionSession } from '../../helpers/mongo/withTransaction';

// types
import {
  CustomPopulateOptions,
  GetModelQuery,
  UpdateModelQuery,
} from '../../types/custom';

// const
import { DEFAULT_TEMPLATE_DATA } from 'shared-const';

@Injectable()
export class CommonTemplatesService {
  constructor(
    private awsService: AwsConnectorService,
    private countersService: CountersService,
    @InjectModel(CommonTemplate.name)
    private commonTemplate: Model<CommonTemplateDocument>,
    @InjectModel(PreviewImage.name)
    private previewImage: Model<PreviewImageDocument>,
  ) {}

  async exists({
    query,
  }: {
    query: FilterQuery<CommonTemplateDocument>;
  }): Promise<boolean> {
    const existedDocument = await this.commonTemplate.exists(query).exec();

    return Boolean(existedDocument?._id);
  }

  async findCommonTemplates({
    query,
    options,
    populatePaths,
    session,
  }: GetModelQuery<CommonTemplateDocument>) {
    return this.commonTemplate
      .find(
        query,
        {},
        {
          populate: populatePaths,
          limit: options?.limit,
          skip: options?.skip,
          sort: options?.sort,
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
    options,
  }: GetModelQuery<CommonTemplateDocument>) {
    return this.commonTemplate
      .findOne(
        query,
        {},
        {
          session: session?.session,
          populate: populatePaths,
          sort: options?.sort,
        },
      )
      .exec();
  }

  async createCommonTemplate({
    data,
    session,
  }: {
    data: UpdateQuery<CommonTemplateDocument>;
    session?: ITransactionSession;
  }) {
    const counter = await this.countersService.updateOne({
      query: {
        key: Counters.Templates,
      },
      data: {
        $inc: { value: 1 },
      },
      session,
    });
    return this.commonTemplate.create({
      ...DEFAULT_TEMPLATE_DATA,
      templateId: counter.value,
      ...data,
    });
  }

  async countCommonTemplates({ query }: { query: QueryOptions }) {
    return this.commonTemplate.count(query);
  }

  async updateCommonTemplate({
    query,
    data,
    session,
    populatePaths,
  }: UpdateModelQuery<
    CommonTemplateDocument,
    CommonTemplate
  >): Promise<CommonTemplateDocument> {
    const options: QueryOptions = {
      session: session?.session,
      populate: populatePaths,
      new: true,
    };

    return this.commonTemplate.findOneAndUpdate(query, data, options).exec();
  }

  async createPreview({
    data: {
      uploadKey,
      size,
      url,
      resolution
    },
    session
  }: {
    data: {
      uploadKey: string;
      size: number;
      url: string;
      resolution: number;
    };
    session: ITransactionSession
  }) {
    const [newPreview] = await this.previewImage.create([{
      url,
      resolution,
      size,
      mimeType: 'image/webp',
      key: uploadKey,
    }], { session: session?.session });

    return newPreview;
  }

  async deleteCommonTemplate({
    query,
    session,
  }: {
    query: FilterQuery<CommonTemplateDocument>;
    session?: ITransactionSession;
  }): Promise<any> {
    const options: QueryOptions = {
      session: session?.session,
    };

    return this.commonTemplate.deleteOne(query, options).exec();
  }

  async aggregate(aggregationPipeline: PipelineStage[]) {
    return this.commonTemplate.aggregate(aggregationPipeline).exec();
  }
}
