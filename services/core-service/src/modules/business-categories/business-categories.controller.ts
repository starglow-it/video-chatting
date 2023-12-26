import { Controller } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { InjectConnection } from '@nestjs/mongoose';

//  const
import { CoreBrokerPatterns, BUSINESS_CATEGORIES_SERVICE } from 'shared-const';

// types
import {
  CreateBusinessCategoryPayload,
  DeletesBusinessCategoriesPayload,
  EntityList,
  GetBusinessCategoriesPayload,
  IBusinessCategory,
  UpdateBusinessCategoryPayload,
} from 'shared-types';

// dtos
import { CommonBusinessCategoryDTO } from '../../dtos/common-business-category.dto';

// services
import { BusinessCategoriesService } from './business-categories.service';

// helpers
import { withTransaction } from '../../helpers/mongo/withTransaction';

@Controller('categories')
export class BusinessCategoriesController {
  constructor(
    @InjectConnection() private connection: Connection,
    private businessCategoriesService: BusinessCategoriesService,
  ) {}

  @MessagePattern({ cmd: CoreBrokerPatterns.GetBusinessCategories })
  async getBusinessCategories(
    @Payload()
    { skip = 0, limit = 6, query = {} }: GetBusinessCategoriesPayload,
  ): Promise<EntityList<IBusinessCategory>> {
    try {
      return withTransaction(this.connection, async (session) => {
        const businessCategories = await this.businessCategoriesService.find({
          query,
          options: { skip, limit },
          session,
        });

        const categoriesCount = await this.businessCategoriesService.count(
          query,
        );

        const parsedCategories = plainToInstance(
          CommonBusinessCategoryDTO,
          businessCategories,
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

  @MessagePattern({ cmd: CoreBrokerPatterns.CreateBusinessCategory })
  async createBusinessCategory({
    color,
    icon,
    key,
    value,
  }: CreateBusinessCategoryPayload) {
    try {
      const newbc = await this.businessCategoriesService.create({
        data: {
          key,
          color,
          value,
          icon,
        },
      });

      return plainToInstance(CommonBusinessCategoryDTO, newbc, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: BUSINESS_CATEGORIES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: CoreBrokerPatterns.UpdateBusinessCategory })
  async updateBusinessCategory({ id, data }: UpdateBusinessCategoryPayload) {
    return withTransaction(this.connection, async (session) => {
      try {
        const keyExisted = await this.businessCategoriesService.exists({
          key: data.key,
          _id: {
            $ne: id,
          },
        });

        if (keyExisted) {
          throw new RpcException('Category must unique');
        }

        const businessCategory =
          await this.businessCategoriesService.findOneAndUpdate({
            query: {
              _id: id,
            },
            data,
            session,
          });

        if (!businessCategory)
          throw new RpcException({
            message: 'Business category not found',
            ctx: BUSINESS_CATEGORIES_SERVICE,
          });

        return plainToInstance(CommonBusinessCategoryDTO, businessCategory, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: BUSINESS_CATEGORIES_SERVICE,
        });
      }
    });
  }

  @MessagePattern({ cmd: CoreBrokerPatterns.DeleteBusinessCategories })
  async deleteBusinessCategories({ ids }: DeletesBusinessCategoriesPayload) {
    try {
      await this.businessCategoriesService.deleteAll({
        query: {
          _id: {
            $in: ids,
          },
        },
      });
      return true;
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: BUSINESS_CATEGORIES_SERVICE,
      });
    }
  }
}
