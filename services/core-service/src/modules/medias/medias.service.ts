import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';

import { IMedia, IMediaCategory } from 'shared-types';

import { GetModelQuery, UpdateModelQuery } from '../../types/custom';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { MediaCategory, MediaCategoryDocument } from 'src/schemas/media-category.schema';
import { Media, MediaDocument } from 'src/schemas/media.schema';

@Injectable()
export class MediaService {
    constructor(
        @InjectModel(MediaCategory.name)
        private mediaCategory: Model<MediaCategoryDocument>,
        @InjectModel(Media.name)
        private media: Model<MediaDocument>
    ) { }

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

    async find({
        query,
        options,
        session,
    }: GetModelQuery<MediaCategoryDocument>) {
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
}
