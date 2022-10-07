import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as fsPromises from 'fs/promises';

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
import { Counters } from '@shared/const/counters.const';

// helpers
import { ITransactionSession } from '../../helpers/mongo/withTransaction';

// types
import { CustomPopulateOptions } from '../../types/custom';

// const
import { DEFAULT_TEMPLATE_DATA } from '@shared/const/template-draft-data';

// utils
import { getScreenShots } from '../../utils/images/getScreenShots';

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
    sort,
  }: {
    query: FilterQuery<CommonTemplateDocument>;
    session?: ITransactionSession;
    populatePaths?: CustomPopulateOptions;
    sort?: string;
  }) {
    return this.commonTemplate
      .findOne(
        query,
        {},
        { session: session?.session, populate: populatePaths, sort },
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

    await this.previewImage.deleteMany({
      key: new RegExp(`^templates/images/${id}`),
    });

    await this.awsService.deleteResource(`templates/images/${id}`);

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
        mimeType: 'image/png',
        key: uploadKey,
      });
    });

    return Promise.all(uploadedImagesPromises);
  }
}
