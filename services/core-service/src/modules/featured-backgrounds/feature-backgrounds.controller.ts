import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Connection } from 'mongoose';
import { CoreBrokerPatterns, FEATURED_BACKGROUND_SERVICE, MEDIA_SERVICE, USER_NOT_FOUND } from 'shared-const';
import { CreateFeaturedBackgroundPayload, DeleteFeaturedBackgroundPayload, EntityList, GetFeaturedBackgroundPayload, IFeaturedBackground, UploadFeaturedBackgroundPayload } from 'shared-types';
import { CommonFeatureBackgroundDTO } from '../../dtos/common-featured-background.dto';
import { withTransaction } from '../../helpers/mongo/withTransaction';
import { PreviewImageDocument } from '../../schemas/preview-image.schema';
import { PreviewUrls } from '../../types/media';
import { retry } from '../../utils/common/retry';
import { FeaturedBackgroundsService } from './featured-backgrounds.service';
import { UsersService } from '../users/users.service';
import { UserDocument } from 'src/schemas/user.schema';

@Controller('featured-background')
export class FeaturedBackgroundsController {
  constructor(
    @InjectConnection() private connection: Connection,
    private readonly featuredBackgroundService: FeaturedBackgroundsService,
    private readonly usersService: UsersService,
  ) { }

  //#region private method
  private async generatePreviewUrs({ url, id, mimeType }: { url: string, id: string, mimeType: string }): Promise<PreviewUrls> {
    try {
      const mimeTypeList = ['image', 'video', 'audio'];

      const mediaType = mimeTypeList.find(type => mimeType.includes(type));
      let previewImages: PreviewImageDocument[] = [];

      if (mediaType !== 'audio') {
        previewImages = await this.featuredBackgroundService.generatePreviews({
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
        ctx: FEATURED_BACKGROUND_SERVICE
      })
    }
  }

  @MessagePattern({ cmd: CoreBrokerPatterns.CreateFeaturedBackground })
  async createFeaturedBackground(@Payload() {
    userId
  }: CreateFeaturedBackgroundPayload) {
    return withTransaction(this.connection, async session => {
      try {

        let user: UserDocument = null
        if (userId) {
          user = await this.usersService.findById(userId, session);

          if (!user) {
            throw new RpcException({ ...USER_NOT_FOUND, ctx: FEATURED_BACKGROUND_SERVICE });
          }
        }

        const newBackground = await this.featuredBackgroundService.createFeaturedBackground({
          data: {
            url: '',
            type: '',
            previewUrls: [],
            createdBy : user
          },
          session
        });

        return plainToInstance(CommonFeatureBackgroundDTO, newBackground, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        });
      }
      catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: FEATURED_BACKGROUND_SERVICE
        });
      }
    });
  }

  @MessagePattern({ cmd: CoreBrokerPatterns.UploadFeaturedBackgroundFile })
  async uploadFeatureBackgroundFile(
    @Payload() {
      id,
      mimeType,
      url
    }: UploadFeaturedBackgroundPayload,
  ): Promise<void> {
    try {
      return withTransaction(this.connection, async () => {
        const maxRetries = 10;
        const previewUrls = await retry<PreviewUrls>(async () => {
          return await this.generatePreviewUrs({
            url,
            id,
            mimeType: mimeType
          });
        }, maxRetries);

        const featuredBackground = await this.featuredBackgroundService.updateFeaturedBackround({
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
        return plainToInstance(CommonFeatureBackgroundDTO, featuredBackground, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        });
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: FEATURED_BACKGROUND_SERVICE,
      });
    }
  }


  @MessagePattern({ cmd: CoreBrokerPatterns.GetFeaturedBackground })
  async getMedias(@Payload() payload: GetFeaturedBackgroundPayload): Promise<EntityList<IFeaturedBackground>> {
    return withTransaction(this.connection, async session => {
      try {
        const { skip, limit } = payload;

        const skipQuery = skip || 0;
        const limitQuery = limit || 8;

        const featuredCount = await this.featuredBackgroundService.countFeatureBackgrounds({});

        const featureBackground = await this.featuredBackgroundService.findFeaturedBackgrounds({
          query: {},
          options: {
            skip: skipQuery * limitQuery,
            limit: limitQuery
          },
          session,
          populatePaths: ['previewUrls']
        });


        const plainFeaturedBackground = plainToInstance(CommonFeatureBackgroundDTO, featureBackground, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        });

        return {
          list: plainFeaturedBackground,
          count: featuredCount,
        };
      }
      catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: FEATURED_BACKGROUND_SERVICE
        });
      }
    });
  }

  @MessagePattern({ cmd: CoreBrokerPatterns.DeleteFeatureBackground })
  async deleteFeaturedBackground(@Payload() payload: DeleteFeaturedBackgroundPayload): Promise<void> {
    return withTransaction(this.connection, async (session) => {
      try {
        const { ids } = payload;
        await this.featuredBackgroundService.deleteFeaturedBackgrounds({
          query: {
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
          ctx: FEATURED_BACKGROUND_SERVICE
        });
      }
    });
  }
}
