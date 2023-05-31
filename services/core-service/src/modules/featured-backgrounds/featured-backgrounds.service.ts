import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';

import { GetModelQuery, UpdateModelQuery } from '../../types/custom';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { PreviewImage, PreviewImageDocument } from '../../schemas/preview-image.schema';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { getScreenShots } from '../../utils/images/getScreenShots';
import { AwsConnectorService } from '../../services/aws-connector/aws-connector.service';
import { RpcException } from '@nestjs/microservices';
import { MEDIA_SERVICE } from 'shared-const';
import { FeaturedBackground, FeaturedBackgroundDocument } from 'src/schemas/featured-background.schema';
import { IFeaturedBackground } from 'shared-types';

@Injectable()
export class FeaturedBackgroundsService {
    constructor(
        private awsService: AwsConnectorService,
        @InjectModel(PreviewImage.name)
        private previewImage: Model<PreviewImageDocument>,
        @InjectModel(FeaturedBackground.name)
        private featuredBackground: Model<FeaturedBackgroundDocument>,
    ) { }



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

            const keyFolder = `^featured-backgrounds/images/${id}`;

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
        catch (err) {
            console.error(`Failed to generate previews for media item "${id}":`, err);
            throw new RpcException({
                message: err.message,
                ctx: MEDIA_SERVICE
            });
        }
    }


    async createFeaturedBackgrounds({
        data,
        session,
    }: {
        data: Partial<FeaturedBackgroundDocument>[];
        session?: ITransactionSession;
    }) {
        const newFeaturedBackgrounds = await this.featuredBackground.insertMany(data, {
            session: session?.session,
        });

        return newFeaturedBackgrounds;
    }

    async createFeaturedBackground({
        data,
        session,
    }: {
        data: Partial<FeaturedBackgroundDocument>;
        session?: ITransactionSession;
    }): Promise<FeaturedBackgroundDocument> {
        const [newFeaturedBackground] = await this.featuredBackground.create([data], {
            session: session?.session,
        });

        return newFeaturedBackground;
    }

    async findFeaturedBackgrounds({
        query,
        options,
        session,
    }: GetModelQuery<FeaturedBackgroundDocument>): Promise<FeaturedBackgroundDocument[]> {
        return this.featuredBackground
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

    async updateFeaturedBackround({
        query,
        data,
        session,
        populatePaths,
    }: UpdateModelQuery<
        FeaturedBackgroundDocument,
        IFeaturedBackground
    >): Promise<FeaturedBackgroundDocument> {
        return this.featuredBackground.findOneAndUpdate(query, data, {
            session: session?.session,
            populate: populatePaths,
            new: true,
        });
    }

    async existFeaturedBackground(query: FilterQuery<FeaturedBackgroundDocument>): Promise<boolean> {
        const existedDocument = await this.featuredBackground.exists(query).exec();

        return Boolean(existedDocument?._id);
    }

    async countFeatureBackgrounds(query: FilterQuery<FeaturedBackgroundDocument>): Promise<number> {
        return this.featuredBackground.count(query).exec();
    }

    async deleteFeaturedBackgrounds({
        query,
        session,
    }: {
        query: FilterQuery<FeaturedBackgroundDocument>;
        session?: ITransactionSession;
    }): Promise<any> {
        return this.featuredBackground.deleteMany(query, {
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

    async deleteFeaturedBackgroundFolders(keyFolder: string) {
        await this.awsService.deleteFolder(`featured-backgrounds/${keyFolder}`);
    }

    async aggregate(aggregationPipeline: PipelineStage[]) {
        return this.featuredBackground.aggregate(aggregationPipeline).exec();
    }
}
