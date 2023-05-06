import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, QueryOptions } from 'mongoose';

import { IMedia, IMediaCategory } from 'shared-types';

import { GetModelQuery, UpdateModelQuery } from '../../types/custom';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { MediaCategory, MediaCategoryDocument } from 'src/schemas/media-category.schema';
import { Media, MediaDocument } from '../../schemas/media.schema';
import { PreviewImage, PreviewImageDocument } from '../../schemas/preview-image.schema';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { getScreenShots } from '../../utils/images/getScreenShots';
import { AwsConnectorService } from 'src/services/aws-connector/aws-connector.service';

@Injectable()
export class MediaService {
    constructor(
        private awsService: AwsConnectorService,
        @InjectModel(MediaCategory.name)
        private mediaCategory: Model<MediaCategoryDocument>,
        @InjectModel(Media.name)
        private media: Model<MediaDocument>,
        @InjectModel(PreviewImage.name)
        private previewImage: Model<PreviewImageDocument>,
    ) { }



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
    }

    async createCategory({
        data,
        session,
    }: {
        data: IMediaCategory;
        session?: ITransactionSession;
    }): Promise<MediaCategoryDocument> {
        const [newTag] = await this.mediaCategory.create([data], {
            session: session?.session,
        });

        return newTag;
    }

    async createMedias({
        data,
        session,
    }: {
        data: Partial<MediaDocument>[];
        session?: ITransactionSession;
    }) {
        const newMedia = await this.media.insertMany(data, {
            session: session?.session,
        });

        return newMedia;
    }

    async createMedia({
        data,
        session,
    }: {
        data: Partial<MediaDocument>;
        session?: ITransactionSession;
    }): Promise<MediaDocument> {
        const [newMedia] = await this.media.create([data], {
            session: session?.session,
        });

        return newMedia;
    }

    async findCategories({
        query,
        options,
        session,
    }: GetModelQuery<MediaCategoryDocument>): Promise<MediaCategoryDocument[]> {
        return this.mediaCategory
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

    async findMedias({
        query,
        options,
        session,
        populatePaths
    }: GetModelQuery<MediaDocument>) {
        return this.media
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

    async findMediaCategory({
        query,
        session,
        populatePaths,
    }: GetModelQuery<MediaCategoryDocument>): Promise<MediaCategoryDocument> {
        return this.mediaCategory
            .findOne(query, {}, { session: session?.session, populate: populatePaths })
            .exec();
    }

    async updateMediaCategory({
        query,
        data,
        session,
        populatePaths,
    }: UpdateModelQuery<
        MediaCategoryDocument,
        IMediaCategory
    >): Promise<MediaCategoryDocument> {
        return this.mediaCategory.findOneAndUpdate(query, data, {
            session: session?.session,
            populate: populatePaths,
            new: true,
        });
    }

    async updateMedia({
        query,
        data,
        session,
        populatePaths,
    }: UpdateModelQuery<
        MediaDocument,
        IMedia
    >): Promise<MediaDocument> {
        return this.media.findOneAndUpdate(query, data, {
            session: session?.session,
            populate: populatePaths,
            new: true,
        });
    }

    async existCategories(query: FilterQuery<MediaCategoryDocument>): Promise<boolean> {
        const existedDocument = await this.mediaCategory.exists(query).exec();

        return Boolean(existedDocument?._id);
    }

    async countCategories(query: FilterQuery<MediaCategoryDocument>): Promise<number> {
        return this.mediaCategory.count(query).exec();
    }

    async countMedias(query: FilterQuery<MediaDocument>): Promise<number> {
        return this.media.count(query).exec();
    }

    async deleteMedias({
        query,
        session,
    }: {
        query: FilterQuery<MediaDocument>;
        session?: ITransactionSession;
    }): Promise<any> {
        return this.media.deleteMany(query, {
            session: session?.session,
        });
    }


    async deleteMediaCategories({
        query,
        session,
    }: {
        query: FilterQuery<MediaCategoryDocument>;
        session?: ITransactionSession;
    }): Promise<any> {
        return this.mediaCategory.deleteMany(query, {
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

    async deleteMediaFolders(keyFolder: string) {
        await this.awsService.deleteFolder(`media/${keyFolder}`);
    }

    async aggregate(aggregationPipeline: PipelineStage[]) {
        return this.media.aggregate(aggregationPipeline).exec();
      }
}
