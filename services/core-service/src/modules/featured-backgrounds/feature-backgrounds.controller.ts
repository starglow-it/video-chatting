import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Connection } from 'mongoose';
import {
  CoreBrokerPatterns,
  FEATURED_BACKGROUND_SERVICE,
  USER_NOT_FOUND,
} from 'shared-const';
import {
  CreateFeaturedBackgroundPayload,
  DeleteFeaturedBackgroundsPayload,
  EntityList,
  GetFeaturedBackgroundsPayload,
  IFeaturedBackground,
  UploadFeaturedBackgroundPayload,
} from 'shared-types';
import { CommonFeatureBackgroundDTO } from '../../dtos/common-featured-background.dto';
import { withTransaction } from '../../helpers/mongo/withTransaction';
import { PreviewImageDocument } from '../../schemas/preview-image.schema';
import { retry } from '../../utils/common/retry';
import { FeaturedBackgroundsService } from './featured-backgrounds.service';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../../schemas/user.schema';
import { PreviewUrls } from '../../types/featured-background';

@Controller('featured-background')
export class FeaturedBackgroundsController {
  constructor(
    @InjectConnection() private connection: Connection,
    private readonly featuredBackgroundService: FeaturedBackgroundsService,
    private readonly usersService: UsersService,
  ) {}

  //#region private method
  private async generatePreviewUrs({
    url,
    id,
    mimeType,
  }: {
    url: string;
    id: string;
    mimeType: string;
  }): Promise<PreviewUrls> {
    try {
      let previewImages: PreviewImageDocument[] = [];

      const mimeTypeList = ['image', 'video'];
      const mediaType = mimeTypeList.find((type) => mimeType.includes(type));

      previewImages = await this.featuredBackgroundService.generatePreviews({
        url,
        id,
        mimeType,
      });

      return {
        previewImages,
        type: mediaType,
      };
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: FEATURED_BACKGROUND_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: CoreBrokerPatterns.CreateFeaturedBackground })
  async createFeaturedBackground(
    @Payload() { userId }: CreateFeaturedBackgroundPayload,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const user = await this.usersService.findById(userId, session);

        if (!user)
          throw new RpcException({
            ...USER_NOT_FOUND,
            ctx: FEATURED_BACKGROUND_SERVICE,
          });

        const newBackground =
          await this.featuredBackgroundService.createFeaturedBackground({
            data: {
              url: '',
              type: '',
              previewUrls: [],
              createdBy: user,
            },
            session,
          });

        return plainToInstance(CommonFeatureBackgroundDTO, newBackground, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: FEATURED_BACKGROUND_SERVICE,
        });
      }
    });
  }

  @MessagePattern({ cmd: CoreBrokerPatterns.UploadFeaturedBackgroundFile })
  async uploadFeatureBackgroundFile(
    @Payload() { id, mimeType, url }: UploadFeaturedBackgroundPayload,
  ): Promise<void> {
    try {
      return withTransaction(this.connection, async () => {
        const maxRetries = 10;
        const previewUrls = await retry<PreviewUrls>(async () => {
          return await this.generatePreviewUrs({
            url,
            id,
            mimeType: mimeType,
          });
        }, maxRetries);

        const featuredBackground =
          await this.featuredBackgroundService.updateFeaturedBackround({
            query: {
              _id: id,
            },
            data: {
              type: previewUrls.type,
              previewUrls: previewUrls.previewImages,
              url,
            },
            populatePaths: [
              {
                path: 'previewUrls',
              },
            ],
          });
        return plainToInstance(CommonFeatureBackgroundDTO, featuredBackground, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: FEATURED_BACKGROUND_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: CoreBrokerPatterns.GetFeaturedBackgrounds })
  async getFeatureBackgrounds(
    @Payload() payload: GetFeaturedBackgroundsPayload,
  ): Promise<EntityList<IFeaturedBackground>> {
    return withTransaction(this.connection, async (session) => {
      try {
        const { skip, limit } = payload;

        const skipQuery = skip || 0;
        const limitQuery = limit || 8;

        const featuredCount =
          await this.featuredBackgroundService.countFeatureBackgrounds({});

        const featureBackground =
          await this.featuredBackgroundService.findFeaturedBackgrounds({
            query: {},
            options: {
              skip: skipQuery * limitQuery,
              limit: limitQuery,
            },
            session,
            populatePaths: [
              {
                path: 'previewUrls',
              },
              {
                path: 'createdBy',
                populate: 'profileAvatar',
              },
            ],
          });

        const plainFeaturedBackground = plainToInstance(
          CommonFeatureBackgroundDTO,
          featureBackground,
          {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          },
        );

        return {
          list: plainFeaturedBackground,
          count: featuredCount,
        };
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: FEATURED_BACKGROUND_SERVICE,
        });
      }
    });
  }

  @MessagePattern({ cmd: CoreBrokerPatterns.DeleteFeatureBackgrounds })
  async deleteFeaturedBackground(
    @Payload() payload: DeleteFeaturedBackgroundsPayload,
  ): Promise<void> {
    return withTransaction(this.connection, async (session) => {
      try {
        const { ids } = payload;
        await this.featuredBackgroundService.deleteFeaturedBackgrounds({
          query: {
            _id: {
              $in: ids,
            },
          },
          session,
        });

        await this.featuredBackgroundService.deleteFeaturedBackgroundFolders(
          'images',
        );
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: FEATURED_BACKGROUND_SERVICE,
        });
      }
    });
  }
}
