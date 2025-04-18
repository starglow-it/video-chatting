import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, PipelineStage, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as fsPromises from 'fs/promises';

// schemas
import {
  PreviewImage,
  PreviewImageDocument,
} from '../../schemas/preview-image.schema';

// services
import { AwsConnectorService } from '../../services/aws-connector/aws-connector.service';
import { CountersService } from '../counters/counters.service';

// helpers
import { ITransactionSession } from '../../helpers/mongo/withTransaction';

// types
import {
  CustomPopulateOptions,
  GetModelMultipleQuery,
  UpdateModelMultipleQuery,
  UpdateModelSingleQuery,
} from '../../types/custom';
import { getScreenShots } from '../../utils/images/getScreenShots';
import { DEFAULT_TEMPLATE_DATA } from 'shared-const';
import { Counters } from 'shared-types';
import {
  CommonTemplate,
  CommonTemplateDocument,
} from '../../schemas/common-template.schema';

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
  }: GetModelMultipleQuery<CommonTemplateDocument>) {
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

  joinCommonTemplatePropertiesQueries(): PipelineStage[] {
    const joinBusinessCategories: PipelineStage = {
      $lookup: {
        from: 'businesscategories',
        localField: 'businessCategories',
        foreignField: '_id',
        as: 'businessCategories',
      },
    };
    const joinPreviewImages: PipelineStage = {
      $lookup: {
        from: 'previewimages',
        localField: 'previewUrls',
        foreignField: '_id',
        as: 'previewUrls',
      },
    };

    const joinAuthor: PipelineStage = {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'profileavatars',
              localField: 'profileAvatar',
              foreignField: '_id',
              as: 'profileAvatar',
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    __v: 0,
                  },
                },
              ],
            },
          },
          {
            $set: {
              profileAvatar: {
                $first: '$profileAvatar',
              },
            },
          },
          {
            $project: {
              profileAvatar: 1,
              role: 1,
              fullName: 1,
            },
          },
        ],
        as: 'author',
      },
    };
    return [joinBusinessCategories, joinPreviewImages, joinAuthor];
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
  }: GetModelMultipleQuery<CommonTemplateDocument>) {
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
    data: Partial<CommonTemplateDocument>;
    session?: ITransactionSession;
  }) {
    const isTemplatesCounterExists = await this.countersService.exists({
      key: Counters.Templates,
    });

    if (isTemplatesCounterExists) {
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

    const newCounter = await this.countersService.create({
      data: {
        key: Counters.Templates,
        value: 1,
      },
    });

    return this.commonTemplate.create({
      ...DEFAULT_TEMPLATE_DATA,
      templateId: newCounter.value,
      ...data,
    });
  }

  async countCommonTemplates({
    query,
  }: {
    query: QueryOptions;
  }): Promise<number> {
    return this.commonTemplate.count(query);
  }

  async updateCommonTemplate({
    query,
    data,
    session,
    populatePaths,
  }: UpdateModelSingleQuery<CommonTemplateDocument>): Promise<CommonTemplateDocument> {
    const options: QueryOptions = {
      session: session?.session,
      populate: populatePaths,
      new: true,
    };

    return this.commonTemplate.findOneAndUpdate(query, data, options).exec();
  }

  async updateCommonTemplates({
    query,
    data,
    session,
  }: UpdateModelMultipleQuery<CommonTemplateDocument>): Promise<any> {
    const options: QueryOptions = {
      session: session?.session,
    };

    return this.commonTemplate.updateMany(query, data, options).exec();
  }

  async generatePreviews({
    id,
    mimeType,
    url,
  }: {
    id: string;
    mimeType: string;
    url: string;
  }) {
    const outputPath = path.join(__dirname, '../../../../images', id);
    await mkdirp(outputPath);

    const fileType = mimeType.split('/')[0];
    await getScreenShots(url, outputPath, fileType);

    const imagesPaths = await fsPromises.readdir(outputPath);

    const uploadedImagesPromises = imagesPaths.map(async (image) => {
      const resolution = image.match(/(\d*)p\./);

      const file = await fsPromises.readFile(`${outputPath}/${image}`);
      const uploadKey = `templates/images/${id}/${image}`;
      const fileStats = await fsPromises.stat(`${outputPath}/${image}`);

      const imageUrl = await this.awsService.uploadFile(file, uploadKey);

      await fsPromises.rm(`${outputPath}/${image}`);

      return this.previewImage.create({
        url: imageUrl,
        resolution: resolution?.[1],
        size: fileStats.size,
        mimeType: 'image/webp',
        key: uploadKey,
      });
    });

    return Promise.all(uploadedImagesPromises);
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

    await this.commonTemplate.deleteOne(query, options).exec();

    return;
  }

  async aggregate(aggregationPipeline: PipelineStage[]) {
    return this.commonTemplate.aggregate(aggregationPipeline).exec();
  }

  async deletePreview({
    id,
    session,
  }: {
    id: string;
    session: ITransactionSession;
  }): Promise<void> {
    await this.previewImage
      .deleteOne({ _id: id }, { session: session?.session })
      .exec();

    return;
  }
}
