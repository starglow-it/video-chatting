import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ResoucesService } from './resouces.service';
import { Connection, UpdateQuery } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { CoreBrokerPatterns, RESOUCE_SERVICE } from 'shared-const';
import {
  EntityList,
  GetResoucesPayload,
  IResouce,
  UploadResoucePayload,
} from 'shared-types';
import { withTransaction } from '../../helpers/mongo/withTransaction';
import { plainToInstance } from 'class-transformer';
import { CommonResouceDto } from '../../dtos/common-resouce.dto';
import { retry } from '../../utils/common/retry';
import { PreviewUrls } from '../../types/resouce';
import { PreviewImageDocument } from '../../schemas/preview-image.schema';

@Controller('Resouce')
export class ResoucesController {
  constructor(
    @InjectConnection() private connection: Connection,
    private resouceService: ResoucesService,
  ) {}

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
      const mimeTypeList = ['image', 'video', 'audio'];

      const type = mimeTypeList.find((type) => mimeType.includes(type));
      let previewImages: PreviewImageDocument[] = [];
      if (type !== 'audio') {
        previewImages = await this.resouceService.generatePreviews({
          url,
          id,
          mimeType,
        });
      }

      return {
        previewImages,
        type,
      };
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: RESOUCE_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: CoreBrokerPatterns.CreateResouce })
  async createUserTemplateMedia(): Promise<IResouce> {
    return withTransaction(this.connection, async (session) => {
      try {
        const resouce = await this.resouceService.createResouce({
          data: {
            url: '',
            previewUrls: [],
            mimeType: '',
            key: '',
            size: 0,
          },
          session,
        });

        return plainToInstance(CommonResouceDto, resouce, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: RESOUCE_SERVICE,
        });
      }
    });
  }

  @MessagePattern({ cmd: CoreBrokerPatterns.UploadResouce })
  async uploadMediaFile(
    @Payload() { id, mimeType, url, size, key }: UploadResoucePayload,
  ) {
    try {
      return withTransaction(this.connection, async (session) => {
        const maxRetries = 10;
        const previewUrls = await retry<PreviewUrls>(async () => {
          return await this.generatePreviewUrs({
            url,
            id,
            mimeType,
          });
        }, maxRetries);

        const resouce = await this.resouceService.update({
          query: {
            _id: id,
          },
          data: {
            type: previewUrls.type,
            previewUrls: previewUrls.previewImages,
            url,
            size,
            mimeType,
            key
          },
          populatePaths: [
            {
              path: 'previewUrls',
            },
          ],
          session
        });

        return plainToInstance(CommonResouceDto, resouce, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: RESOUCE_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: CoreBrokerPatterns.GetResouces })
  async getMedias(
    @Payload() payload: GetResoucesPayload,
  ): Promise<EntityList<IResouce>> {
    return withTransaction(this.connection, async (session) => {
      try {
        const { skip, limit, ids } = payload;

        const skipQuery = skip || 0;
        const limitQuery = limit || 8;
        const query = { _id: { $in: ids } };

        const count = await this.resouceService.count(query);

        const resouces = await this.resouceService.find({
          query,
          options: {
            skip: skipQuery * limitQuery,
            limit: limitQuery,
          },
          session,
          populatePaths: ['previewUrls'],
        });

        const list = plainToInstance(CommonResouceDto, resouces, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        return {
          list,
          count,
        };
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: RESOUCE_SERVICE,
        });
      }
    });
  }
}
