import { Controller } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { InjectConnection } from '@nestjs/mongoose';

//  const
import { CoreBrokerPatterns, CORE_SERVICE, MEDIA_SERVICE } from 'shared-const';

// types
import {
    CreateMediaCategoryPayload,
    CreateMediaPayload,
    DeleteMediaCategoriesPayload,
    DeleteMediasPayload,
    EntityList,
    GetMediaCategoriesPayload,
    GetMediasPayload,
    IMedia,
    IMediaCategory,
    UpdateMediaCategoryPayload,
    UpdateMediaPayload,
    UploadMediaCategoryFile,
    UploadMediaFilePayload,
} from 'shared-types';

import { ITransactionSession, withTransaction } from '../../helpers/mongo/withTransaction';
import { isValidObjectId } from '../../helpers/mongo/isValidObjectId';
import { MediaService } from './medias.service';
import { CommonMediaCategoryDTO } from '../../dtos/common-media-categories.dto';
import { CommonMediaDTO } from '../../dtos/common-media.dto';
import { UserTemplatesService } from '../user-templates/user-templates.service';
import { MediaCategoryDocument } from 'src/schemas/media-category.schema';
import { retry } from '../../utils/common/retry';
import { PreviewImageDocument } from 'src/schemas/preview-image.schema';
import { PreviewUrls } from '../../types/media';

@Controller('medias')
export class MediaController {
    constructor(
        @InjectConnection() private connection: Connection,
        private mediaService: MediaService,
        private userTemplateService: UserTemplatesService
    ) { }


    //#region private method
    private async generatePreviewUrs({ url, id, mimeType }: { url: string, id: string, mimeType: string }): Promise<PreviewUrls> {
        try {
            const mimeTypeList = ['image', 'video', 'audio'];

            const mediaType = mimeTypeList.find(type => mimeType.includes(type));
            let previewImages: PreviewImageDocument[] = [];

            if (mediaType !== 'audio') {
                previewImages = await this.mediaService.generatePreviews({
                    url,
                    id,
                    mimeType,
                });
            }

            return {
                previewImages,
                mediaType
            };
        }
        catch (err) {
            throw new RpcException({
                message: err.message,
                ctx: MEDIA_SERVICE
            })
        }
    }

    private async getUserTemplate({ userTemplateId, session }:
        {
            userTemplateId: string,
            session: ITransactionSession
        }) {
        const userTemplate = await this.userTemplateService.findUserTemplateById({
            id: userTemplateId,
            populatePaths: ['user'],
            session
        });

        if (!userTemplate)
            throw new RpcException({
                message: 'User Template not found',
                ctx: MEDIA_SERVICE
            });

        return userTemplate;
    }


    private async getMediaQuery({ userTemplateId, mediaCategory, session }:
        {
            userTemplateId: string,
            mediaCategory: MediaCategoryDocument,
            session: ITransactionSession
        }) {

        let userTemplateQuery = null;

        if (userTemplateId) {
            const userTemplate = await this.getUserTemplate({ userTemplateId, session });
            userTemplateQuery = {
                $in: mediaCategory.key === 'myrooms' ?
                    userTemplate.user.templates :
                    [userTemplate, null]
            };

        };
        return {
            mediaCategory: mediaCategory._id,
            userTemplate: userTemplateQuery
        };

    }

    private async getMediaCategories({ query, skip, limit, session }:
        {
            query: unknown,
            skip: number,
            limit: number,
            session: ITransactionSession
        }) {
        const mediaCategories = await this.mediaService.findCategories({
            query,
            ...((skip && limit) && {
                options: { skip: skip * limit, limit }
            }),
            session,
        });

        const categoriesCount = await this.mediaService.countCategories(query);

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
    }
    //#endregion



    //#region public method
    @MessagePattern({ cmd: CoreBrokerPatterns.GetMediaCategories })
    async getMediaCategoriesByUser(
        @Payload() { skip, limit, type, }: GetMediaCategoriesPayload,
    ): Promise<EntityList<IMediaCategory>> {
        try {
            return withTransaction(this.connection, async (session) => {
                const query = { type };
                return await this.getMediaCategories({ query, skip, limit, session });
            });
        } catch (err) {
            throw new RpcException({
                message: err.message,
                ctx: MEDIA_SERVICE,
            });
        }
    }


    @MessagePattern({ cmd: CoreBrokerPatterns.GetAdminMediaCategories })
    async getMediaCategoriesByAdmin(
        @Payload() { skip, limit, type }: GetMediaCategoriesPayload,
    ): Promise<EntityList<IMediaCategory>> {
        try {
            return withTransaction(this.connection, async (session) => {
                const query = {
                    type,
                    key: {
                        $ne: 'myrooms'
                    }
                }
                return await this.getMediaCategories({ query, skip, limit, session });
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
                const { skip, limit, categoryId, userTemplateId } = payload;

                const skipQuery = skip || 0;
                const limitQuery = limit || 8;

                const mediaCategory = await this.mediaService.findMediaCategory({
                    query: isValidObjectId(categoryId) ? { _id: categoryId } : {},
                    session
                });

                if (!mediaCategory) {
                    throw new RpcException({
                        message: 'Media category not found',
                        ctx: CORE_SERVICE,
                    });
                }

                const query = await this.getMediaQuery({
                    userTemplateId,
                    mediaCategory,
                    session
                });

                const mediasCount = await this.mediaService.countMedias(query);

                const medias = await this.mediaService.findMedias({
                    query,
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
                console.log("uploadMediaFile: url", url);
                const maxRetries = 10;
                const previewUrls = await retry<PreviewUrls>(async () => {
                    return await this.generatePreviewUrs({
                        url,
                        id,
                        mimeType: mimeType
                    });
                }, maxRetries);

                const media = await this.mediaService.updateMedia({
                    query: {
                        _id: id,
                    },
                    data: {
                        type: previewUrls.mediaType,
                        previewUrls: previewUrls.previewImages,
                        url,
                    },
                    populatePaths: [{
                        path: 'previewUrls'
                    }]
                });

                console.log("uploadMediaFile: media", media);
                return plainToInstance(CommonMediaDTO, media, {
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


    @MessagePattern({ cmd: CoreBrokerPatterns.UploadMediaCategoryFile })
    async uploadMediaCategory(
        @Payload() {
            id,
            mimeType,
            url
        }: UploadMediaCategoryFile,
    ): Promise<CommonMediaCategoryDTO> {
        try {
            if (!mimeType.includes('image')) {
                throw new RpcException({
                    message: 'File must be image type',
                    ctx: MEDIA_SERVICE
                });
            }

            const category = await this.mediaService.updateMediaCategory({
                query: {
                    _id: id,
                },
                data: {
                    emojiUrl: url
                }
            });
            return plainToInstance(CommonMediaCategoryDTO, category, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true
            });
        } catch (err) {
            throw new RpcException({
                message: err.message,
                ctx: MEDIA_SERVICE,
            });
        }
    }

    @MessagePattern({ cmd: CoreBrokerPatterns.CreateMediaCategory })
    async createMediaCategory(@Payload() {
        key, type, value, emojiUrl
    }: CreateMediaCategoryPayload) {
        try {
            const mediaCategoriesCount = await this.mediaService.countCategories({
                key,
                type
            });

            if (mediaCategoriesCount) {
                throw new RpcException({
                    message: 'Key must be unique',
                    ctx: MEDIA_SERVICE
                });
            }

            const newCategory = await this.mediaService.createCategory({
                data: {
                    key,
                    type,
                    value,
                    emojiUrl
                }
            });

            return plainToInstance(CommonMediaCategoryDTO, newCategory, {
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
    }


    @MessagePattern({ cmd: CoreBrokerPatterns.CreateMedia })
    async createUserTemplateMedia(@Payload() {
        categoryId,
        userTemplateId
    }: CreateMediaPayload) {
        return withTransaction(this.connection, async session => {
            try {
                let userTemplate = null;
                if (userTemplateId) {
                    userTemplate = await this.getUserTemplate({ userTemplateId, session });
                }

                const mediaCategory = await this.mediaService.findMediaCategory({
                    query: {
                        _id: categoryId
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
                        mediaCategory,
                        userTemplate
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
                });
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

    @MessagePattern({ cmd: CoreBrokerPatterns.UpdateMediaCategory })
    async updateMediaCategory(@Payload() {
        id,
        data
    }: UpdateMediaCategoryPayload) {
        return withTransaction(this.connection, async session => {
            const category = await this.mediaService.updateMediaCategory({
                query: {
                    _id: id
                },
                data,
                session
            });

            if (!category)
                throw new RpcException({
                    message: 'Media Category not found',
                    ctx: MEDIA_SERVICE
                });

            return plainToInstance(CommonMediaCategoryDTO, category, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true
            });
        });
    }


    @MessagePattern({ cmd: CoreBrokerPatterns.DeleteMediaCategories })
    async deleteMediaCategories(@Payload() payload: DeleteMediaCategoriesPayload): Promise<void> {
        return withTransaction(this.connection, async (session) => {
            try {
                const { ids } = payload;
                await this.mediaService.deleteMediaCategories({
                    query: {
                        _id: {
                            $in: ids
                        }
                    },
                    session
                });

                await this.mediaService.deleteMedias({
                    query: {
                        mediaCategory: {
                            $in: ids
                        }
                    },
                    session
                });
            }
            catch (err) {
                throw new RpcException({
                    message: err.message,
                    ctx: MEDIA_SERVICE
                });
            }
        });
    }

    @MessagePattern({ cmd: CoreBrokerPatterns.DeleteMedias })
    async deleteMedias(@Payload() { ids, categoryId, userTemplateId }: DeleteMediasPayload): Promise<void> {
        return withTransaction(this.connection, async (session) => {
            try {
                const mediaCategory = await this.mediaService.findMediaCategory({
                    query: {
                        _id: categoryId
                    },
                    session
                });

                let userTemplate = null;

                if (userTemplateId) {
                    userTemplate = await this.userTemplateService.findUserTemplateById({
                        id: userTemplateId,
                        session
                    });

                    if (!userTemplate) {
                        throw new RpcException({
                            message: 'User template not found'
                        });
                    }
                }

                if (!mediaCategory)
                    throw new RpcException({
                        message: 'Media category not found',
                        ctx: MEDIA_SERVICE
                    });

                await this.mediaService.deleteMedias({
                    query: {
                        mediaCategory,
                        userTemplate,
                        _id: {
                            $in: ids
                        }
                    },
                    session
                });

            }
            catch (err) {
                throw new RpcException({
                    message: err.message,
                    ctx: MEDIA_SERVICE
                });
            }
        });
    }
    //#endregion
}