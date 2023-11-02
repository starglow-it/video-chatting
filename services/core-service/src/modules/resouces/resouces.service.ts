import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  PreviewImage,
  PreviewImageDocument,
} from '../../schemas/preview-image.schema';
import { Resouce, ResouceDocument } from '../../schemas/resouce.schema';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { getScreenShots } from '../../utils/images/getScreenShots';
import { AwsConnectorService } from '../../services/aws-connector/aws-connector.service';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import {
  GetModelMultipleQuery,
  GetModelSingleQuery,
  UpdateModelSingleQuery,
} from '../../types/custom';
import { PipelineStage } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { RESOUCE_SERVICE } from 'shared-const';

@Injectable()
export class ResoucesService {
  constructor(
    private awsService: AwsConnectorService,
    @InjectModel(PreviewImage.name)
    private previewImage: Model<PreviewImageDocument>,
    @InjectModel(Resouce.name) private resouce: Model<ResouceDocument>,
  ) {}

  async generatePreviews({
    id,
    mimeType,
    url,
  }: {
    id: string;
    mimeType: string;
    url: string;
  }): Promise<PreviewImageDocument[]> {
    try {
      const outputPath = path.join(__dirname, '../../../../images', id);
      await mkdirp(outputPath);

      const fileType = mimeType.split('/')[0];
      await getScreenShots(url, outputPath, fileType);

      const imagesPaths = await fsPromises.readdir(outputPath);

      const keyFolder = `^media/images/${id}`;

      await this.previewImage.deleteMany({
        key: new RegExp(keyFolder),
      });

      await this.awsService.deleteFolder(keyFolder);

      const uploadedImagesPromises = imagesPaths.map(async (image) => {
        const filePath = `${outputPath}/${image}`;
        const resolution = image.match(/(\d*)p\./);

        const file = await fsPromises.readFile(filePath);
        const uploadKey = `${keyFolder}/${image}`;
        const fileStats = await fsPromises.stat(filePath);

        const imageUrl = await this.awsService.uploadFile(file, uploadKey);

        await fsPromises.rm(filePath);

        return this.previewImage.create({
          url: imageUrl,
          resolution: resolution?.[1],
          size: fileStats.size,
          mimeType: 'image/webp',
          key: uploadKey,
        });
      });

      return Promise.all(uploadedImagesPromises);
    } catch (err) {
      console.error(`Failed to generate previews for media item "${id}":`, err);
      throw new RpcException({
        message: err.message,
        ctx: RESOUCE_SERVICE,
      });
    }
  }

  async createResouces({
    data,
    session,
  }: {
    data: Partial<ResouceDocument>[];
    session?: ITransactionSession;
  }) {
    const newMedia = await this.resouce.insertMany(data, {
      session: session?.session,
    });

    return newMedia;
  }

  async createResouce({
    data,
    session,
  }: {
    data: Partial<ResouceDocument>;
    session?: ITransactionSession;
  }): Promise<ResouceDocument> {
    const [newMedia] = await this.resouce.create([data], {
      session: session?.session,
    });

    return newMedia;
  }

  async find({
    query,
    options,
    session,
    populatePaths,
  }: GetModelMultipleQuery<ResouceDocument>) {
    return this.resouce
      .find(
        query,
        {},
        {
          skip: options?.skip,
          limit: options?.limit,
          session: session?.session,
          populate: populatePaths,
        },
      )
      .exec();
  }

  async findOne({
    query,
    session,
    populatePaths,
  }: GetModelSingleQuery<ResouceDocument>): Promise<ResouceDocument> {
    return this.resouce
      .findOne(
        query,
        {},
        { session: session?.session, populate: populatePaths },
      )
      .exec();
  }

  async update({
    query,
    data,
    session,
    populatePaths,
  }: UpdateModelSingleQuery<ResouceDocument>): Promise<ResouceDocument> {
    return this.resouce.findOneAndUpdate(query, data, {
      session: session?.session,
      populate: populatePaths,
      new: true,
    });
  }

  async count(query: FilterQuery<ResouceDocument>): Promise<number> {
    return this.resouce.count(query).exec();
  }

  async deleteMany({
    query,
    session,
  }: {
    query: FilterQuery<ResouceDocument>;
    session?: ITransactionSession;
  }): Promise<any> {
    return this.resouce.deleteMany(query, {
      session: session?.session,
    });
  }

  async deletePreviewImages({
    query,
    session,
  }: {
    query: FilterQuery<PreviewImageDocument>;
    session?: ITransactionSession;
  }): Promise<any> {
    return this.previewImage.deleteMany(query, {
      session: session?.session,
    });
  }

  async deleteAwsFolders(keyFolder: string) {
    await this.awsService.deleteFolder(`media/${keyFolder}`);
  }

  async aggregate(aggregationPipeline: PipelineStage[]) {
    return this.resouce.aggregate(aggregationPipeline).exec();
  }
}
