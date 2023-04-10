import { Controller } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { InjectConnection } from '@nestjs/mongoose';

//  const
import { CoreBrokerPatterns, BUSINESS_CATEGORIES_SERVICE, CORE_SERVICE } from 'shared-const';

// types
import {
  EntityList,
  GetMediaCategoriesPayload,
  GetMediasPayload,
  IBusinessCategory,
  IMedia,
  IMediaCategory,
} from 'shared-types';

// dtos

// services

// helpers
import { withTransaction } from '../../helpers/mongo/withTransaction';
import { isValidObjectId } from '../../helpers/mongo/isValidObjectId';
import { MediaService } from './medias.service';
import { CommonMediaCategoryDTO } from 'src/dtos/common-media-categories.dto';
import { CommonMediaDTO } from 'src/dtos/common-media.dto';

@Controller('medias')
export class MediaController {
  constructor(
    @InjectConnection() private connection: Connection,
    private mediaService: MediaService,
  ) { }

  @MessagePattern({ cmd: CoreBrokerPatterns.GetMediaCategories })
  async getMediaCategories(
    @Payload() { skip = 0, limit = 10 }: GetMediaCategoriesPayload,
  ): Promise<EntityList<IMediaCategory>> {
    try {
      return withTransaction(this.connection, async (session) => {
        const mediaCategories = await this.mediaService.find({
          query: {},
          options: { skip, limit },
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
        ctx: BUSINESS_CATEGORIES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: CoreBrokerPatterns.GetMedias })
  async getBusinessMida(@Payload() payload: GetMediasPayload): Promise<EntityList<IMedia>> {
    return withTransaction(this.connection, async session => {
      const { skip, limit, mediaCategoryId } = payload;

      const skipQuery = skip || 0;
      const limitQuery = limit || 8;

      const mediaCategory = await this.mediaService.findMediaCategory({
        query: isValidObjectId(mediaCategoryId) ? { _id: mediaCategoryId } : {},
        session
      });

      console.log(mediaCategory);
      

      if (!mediaCategory) {
        throw new RpcException({
          message: 'Business category not found',
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
          skip: skipQuery,
          limit: limitQuery
        },
        populatePaths: ['mediaCategory', 'previewUrls']
      });


      const plainMedias =  plainToInstance(CommonMediaDTO, medias ,{
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      });

      return {
        list: plainMedias,
        count: mediaCount,
      };
    });
  }

}
