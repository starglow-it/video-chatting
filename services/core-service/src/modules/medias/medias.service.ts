import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';

import { IMedia, IMediaCategory, IUserTemplateMedia } from 'shared-types';

import { GetModelQuery, UpdateModelQuery } from '../../types/custom';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { MediaCategory, MediaCategoryDocument } from 'src/schemas/media-category.schema';
import { Media, MediaDocument } from '../../schemas/media.schema';
import { PreviewImage, PreviewImageDocument } from '../../schemas/preview-image.schema';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { getScreenShots } from 'src/utils/images/getScreenShots';
import { AwsConnectorService } from 'src/services/aws-connector/aws-connector.service';
import { UserTemplateMedia, UserTemplateMediaDocument } from 'src/schemas/user-template-media.schema';

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
        @InjectModel(UserTemplateMedia.name)
        private userTemplateMedia: Model<UserTemplateMediaDocument>
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

        const keyFolder = `^templates/images/${id}`;
        
        await this.previewImage.deleteMany({
            key: new RegExp(keyFolder),
        });
        
        await this.awsService.deleteFolder(keyFolder);
        
        const uploadedImagesPromises = imagesPaths.map(async (image) => {
            const filePath = `${outputPath}/${image}`;
            const resolution = image.match(/(\d*)p\./);

            const file = await fsPromises.readFile(filePath);
            const uploadKey = `templates/images/${id}/${image}`;
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
        data: Omit<IMediaCategory, 'emojiUrl'>;
        session?: ITransactionSession;
    }): Promise<MediaCategoryDocument> {
        const [newTag] = await this.mediaCategory.create([data], {
            session: session?.session,
        });

        return newTag;
    }

    async createUserTemplateMedia({
        data,
        session,
    }: {
        data: Partial<UserTemplateMediaDocument>;
        session?: ITransactionSession;
    }) {
        const [newMedia] = await this.userTemplateMedia.create([data], {
            session: session?.session,
        });

        return newMedia;
    }

    async createUserTemplateMedias({
        data,
        session,
    }: {
        data: Partial<UserTemplateMediaDocument>[];
        session?: ITransactionSession;
    }) {
        const newMedia = await this.userTemplateMedia.insertMany(data, {
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

    async findUserTemplateMedias({
        query,
        options,
        session,
        populatePaths
    }: GetModelQuery<UserTemplateMediaDocument>): Promise<UserTemplateMediaDocument[]> {
        return this.userTemplateMedia
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

    async updateUserTemplateMedia({
        query,
        data,
        session,
        populatePaths,
    }: UpdateModelQuery<
        UserTemplateMediaDocument,
        IUserTemplateMedia
    >): Promise<UserTemplateMediaDocument> {
        return this.userTemplateMedia.findOneAndUpdate(query, data, {
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

    async countUserTemplateMedias(query: FilterQuery<UserTemplateMediaDocument>): Promise<number> {
        return this.userTemplateMedia.count(query).exec();
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

    async deleteUserTemplateMedias({
        query,
        session,
    }: {
        query: FilterQuery<UserTemplateMediaDocument>;
        session?: ITransactionSession;
    }): Promise<any> {

        return this.userTemplateMedia.deleteMany(query, {
            session: session?.session,
        });
    }

    async deleteFolderMedias(keyFolder: string) {
        await this.awsService.deleteFolder(keyFolder);
    }
}
