import { Controller } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { InjectConnection } from '@nestjs/mongoose';

//  const
import { CoreBrokerPatterns, CORE_SERVICE, MEDIA_SERVICE } from 'shared-const';

// types
import {
    CreateMediaPayload,
    CreateUserTemplateMediaPayload,
    EntityList,
    GetMediaCategoriesPayload,
    GetMediasPayload,
    GetUserTemplateMediasPayload,
    IMedia,
    IMediaCategory,
    UpdateMediaPayload,
    UploadMediaFilePayload,
    UploadUserTemplateMediaFilePayload,
} from 'shared-types';

// dtos

// services

// helpers
import { withTransaction } from '../../helpers/mongo/withTransaction';
import { isValidObjectId } from '../../helpers/mongo/isValidObjectId';
import { MediaService } from './medias.service';
import { CommonMediaCategoryDTO } from '../../dtos/common-media-categories.dto';
import { CommonMediaDTO } from '../../dtos/common-media.dto';
import { UserTemplatesService } from '../user-templates/user-templates.service';
import { CommonUserTemplateMediaDTO } from 'src/dtos/common-user-template-media.dto';

@Controller('medias')
export class MediaController {
    constructor(
        @InjectConnection() private connection: Connection,
        private mediaService: MediaService,
        private userTemplateService: UserTemplatesService
    ) { }


    //#region private method
    private async generatePreviewUrs({ url, id, mimeType }: { url: string, id: string, mimeType: string }) {
        const previewImages = await this.mediaService.generatePreviews({
            url,
            id,
            mimeType,
        });

        return previewImages.map((image) => image._id);
    }
    //#endregion

    //#region public method
    @MessagePattern({ cmd: CoreBrokerPatterns.GetMediaCategories })
    async getMediaCategories(
        @Payload() { skip = 0, limit = 10 }: GetMediaCategoriesPayload,
    ): Promise<EntityList<IMediaCategory>> {
        try {
            return withTransaction(this.connection, async (session) => {
                const mediaCategories = await this.mediaService.findCategories({
                    query: {},
                    options: { skip: skip * limit, limit },
                    session,
                });

                const categoriesCount = await this.mediaService.countCategories({
                    query: {},
                });

                const parsedCategories = plainToInstance(
                    CommonMediaCategoryDTO,
                    mediaCategories,
                    {
                        excludeExtraneousValues: true,
                        enableImplicitConversion: true,
                    },
                );

                return {
                    list: parsedCategories,
                    count: categoriesCount,
                };
            });
        } catch (err) {
            throw new RpcException({
                message: err.message,
                ctx: MEDIA_SERVICE,
            });
        }
    }

    @MessagePattern({ cmd: CoreBrokerPatterns.GetMedias })
    async getMedias(@Payload() payload: GetMediasPayload): Promise<EntityList<IMedia>> {
        return withTransaction(this.connection, async session => {
            try {
                const { skip, limit, mediaCategoryId } = payload;

                const skipQuery = skip || 0;
                const limitQuery = limit || 8;

                const mediaCategory = await this.mediaService.findMediaCategory({
                    query: isValidObjectId(mediaCategoryId) ? { _id: mediaCategoryId } : {},
                    session
                });


                if (!mediaCategory) {
                    throw new RpcException({
                        message: 'Media category not found',
                        ctx: CORE_SERVICE,
                    });
                }

                const mediaCount = await this.mediaService.countMedias({
                    mediaCategory: mediaCategory._id
                });

                const medias = await this.mediaService.findMedias({
                    query: {
                        mediaCategory: mediaCategory._id
                    },
                    options: {
                        skip: skipQuery * limitQuery,
                        limit: limitQuery
                    },
                    session,
                    populatePaths: ['mediaCategory', 'previewUrls']
                });


                const plainMedias = plainToInstance(CommonMediaDTO, medias, {
                    excludeExtraneousValues: true,
                    enableImplicitConversion: true
                });

                return {
                    list: plainMedias,
                    count: mediaCount,
                };
            }
            catch (err) {
                throw new RpcException({
                    message: err.message,
                    ctx: MEDIA_SERVICE
                });
            }
        });
    }


    @MessagePattern({ cmd: CoreBrokerPatterns.GetUserTemplateMedias })
    async getUserTemplateMedias(@Payload() payload: GetUserTemplateMediasPayload): Promise<EntityList<IMedia>> {
        return withTransaction(this.connection, async session => {
            try {
                const { skip, limit, mediaCategoryId, userTemplateId } = payload;

                const skipQuery = skip || 0;
                const limitQuery = limit || 8;

                const mediaCategory = await this.mediaService.findMediaCategory({
                    query: isValidObjectId(mediaCategoryId) ? { _id: mediaCategoryId } : {},
                    session
                });

                if (!mediaCategory) {
                    throw new RpcException({
                        message: 'Media category not found',
                        ctx: CORE_SERVICE,
                    });
                }

                const userTemplate = await this.userTemplateService.findUserTemplateById({
                    id: userTemplateId,
                    session
                });

                if(!userTemplate){
                    throw new RpcException({
                        message: 'User Template not found',
                        ctx: MEDIA_SERVICE
                    });
                }

                const mediasCount = await this.mediaService.countUserTemplateMedias({
                    mediaCategory: mediaCategory._id
                });

                const medias = await this.mediaService.findUserTemplateMedias({
                    query: {
                        mediaCategory: mediaCategory._id,
                        userTemplate: userTemplate._id
                    },
                    options: {
                        skip: skipQuery * limitQuery,
                        limit: limitQuery
                    },
                    session,
                    populatePaths: ['mediaCategory', 'previewUrls']
                });


                const plainMedias = plainToInstance(CommonUserTemplateMediaDTO, medias, {
                    excludeExtraneousValues: true,
                    enableImplicitConversion: true
                });

                return {
                    list: plainMedias,
                    count: mediasCount,
                };
            }
            catch (err) {
                throw new RpcException({
                    message: err.message,
                    ctx: MEDIA_SERVICE
                });
            }
        });
    }

    @MessagePattern({ cmd: CoreBrokerPatterns.UploadMediaFile })
    async uploadMediaFile(
        @Payload() {
            id,
            mimeType,
            url
        }: UploadMediaFilePayload,
    ): Promise<void> {
        try {
            return withTransaction(this.connection, async () => {

                const imageIds = await this.generatePreviewUrs({
                    url,
                    id,
                    mimeType
                });

                await this.mediaService.updateMedia({
                    query: {
                        _id: id,
                    },
                    data: {
                        type: mimeType.includes('image') ? 'image' : 'video',
                        previewUrls: imageIds,
                        url,
                    },
                });
                return;
            });
        } catch (err) {
            throw new RpcException({
                message: err.message,
                ctx: MEDIA_SERVICE,
            });
        }
    }

    @MessagePattern({ cmd: CoreBrokerPatterns.UploadUserTemplateMediaFile })
    async uploadUserTemplateMediaFile(
        @Payload() {
            id,
            mimeType,
            url
        }: UploadUserTemplateMediaFilePayload,
    ): Promise<void> {
        try {
            return withTransaction(this.connection, async () => {

                const imageIds = await this.generatePreviewUrs({
                    url,
                    id,
                    mimeType
                });

                const media = await this.mediaService.updateUserTemplateMedia({
                    query: {
                        _id: id,
                    },
                    data: {
                        type: mimeType.includes('image') ? 'image' : 'video',
                        previewUrls: imageIds,
                        url,
                    },
                    populatePaths: [{
                        path: 'previewUrls'
                    }]
                });
                return plainToInstance(CommonUserTemplateMediaDTO, media, {
                    excludeExtraneousValues: true,
                    enableImplicitConversion: true
                });
            });
        } catch (err) {
            throw new RpcException({
                message: err.message,
                ctx: MEDIA_SERVICE,
            });
        }
    }


    @MessagePattern({ cmd: CoreBrokerPatterns.CreateMedia })
    async createMedia(@Payload() {
        mediaCategoryId
    }: CreateMediaPayload) {
        return withTransaction(this.connection, async session => {
            try {
                const mediaCategory = await this.mediaService.findMediaCategory({
                    query: {
                        _id: mediaCategoryId
                    },
                    session
                });

                if (!mediaCategory)
                    throw new RpcException({
                        message: 'Media category not found',
                        ctx: MEDIA_SERVICE
                    });


                const newMedia = await this.mediaService.createMedia({
                    data: {
                        url: '',
                        type: '',
                        previewUrls: [],
                        mediaCategory
                    },
                    session
                });

                return plainToInstance(CommonMediaDTO, newMedia, {
                    excludeExtraneousValues: true,
                    enableImplicitConversion: true
                });
            }
            catch (err) {
                throw new RpcException({
                    message: err.message,
                    ctx: MEDIA_SERVICE
                })
            }
        });
    }


    @MessagePattern({ cmd: CoreBrokerPatterns.CreateUserTemplateMedia })
    async createUserTemplateMedia(@Payload() {
        mediaCategoryId,
        userTemplateId
    }: CreateUserTemplateMediaPayload) {
        return withTransaction(this.connection, async session => {
            try {

                const userTemplate = await this.userTemplateService.findUserTemplateById({
                    id: userTemplateId,
                    session
                });

                if (!userTemplate)
                    throw new RpcException({
                        message: 'User Template not found',
                        ctx: MEDIA_SERVICE
                    });

                const mediaCategory = await this.mediaService.findMediaCategory({
                    query: {
                        _id: mediaCategoryId
                    },
                    session
                });

                if (!mediaCategory)
                    throw new RpcException({
                        message: 'Media category not found',
                        ctx: MEDIA_SERVICE
                    });


                const newMedia = await this.mediaService.createUserTemplateMedia({
                    data: {
                        url: '',
                        type: '',
                        previewUrls: [],
                        mediaCategory,
                        userTemplate: userTemplate._id
                    },
                    session
                });

                return plainToInstance(CommonUserTemplateMediaDTO, newMedia, {
                    excludeExtraneousValues: true,
                    enableImplicitConversion: true
                });
            }
            catch (err) {
                throw new RpcException({
                    message: err.message,
                    ctx: MEDIA_SERVICE
                })
            }
        });
    }

    @MessagePattern({ cmd: CoreBrokerPatterns.UpdateMedia })
    async updateMedia(@Payload() {
        id,
        data
    }: UpdateMediaPayload) {
        return withTransaction(this.connection, async session => {
            const media = await this.mediaService.updateMedia({
                query: {
                    _id: id
                },
                data,
                session
            });

            if (!media)
                throw new RpcException({
                    message: 'Media not found',
                    ctx: MEDIA_SERVICE
                });

            return plainToInstance(CommonMediaDTO, media, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true
            });
        });
    }
    //#endregion
}