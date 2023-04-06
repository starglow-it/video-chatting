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
  GetBusinessCategoriesPayload,
  GetBusinessMediasPayload,
  IBusinessCategory,
} from 'shared-types';

// dtos
import { CommonBusinessCategoryDTO } from '../../dtos/common-business-category.dto';

// services
import { BusinessCategoriesService } from './business-categories.service';

// helpers
import { withTransaction } from '../../helpers/mongo/withTransaction';
import { CommonBusinessMediaDTO } from 'src/dtos/common-business-media.dto';
import { isValidObjectId } from 'src/helpers/mongo/isValidObjectId';

@Controller('categories')
export class BusinessCategoriesController {
  constructor(
    @InjectConnection() private connection: Connection,
    private businessCategoriesService: BusinessCategoriesService,
  ) { }

  @MessagePattern({ cmd: CoreBrokerPatterns.GetBusinessCategories })
  async getBusinessCategories(
    @Payload() { skip = 0, limit = 6 }: GetBusinessCategoriesPayload,
  ): Promise<EntityList<IBusinessCategory>> {
    try {
      return withTransaction(this.connection, async (session) => {
        const businessCategories = await this.businessCategoriesService.find({
          query: {},
          options: { skip, limit },
          session,
        });

        const categoriesCount = await this.businessCategoriesService.count({
          query: {},
        });

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

  @MessagePattern({ cmd: CoreBrokerPatterns.GetBusinessMedias })
  async getBusinessMida(@Payload() payload: GetBusinessMediasPayload): Promise<EntityList<IBusinessCategory>> {
    return withTransaction(this.connection, async session => {
      const { skip, limit, businessCategoryId } = payload;

      const skipQuery = skip || 0;
      const limitQuery = limit || 8;

      const businessCategory = await this.businessCategoriesService.findBusinessCategory({
        query: isValidObjectId(businessCategoryId) ? { businessCategory: businessCategoryId } : {},
        session
      });

      if (!businessCategory) {
        throw new RpcException({
          message: 'Business category not found',
          ctx: CORE_SERVICE,
        });
      }

      const mediaCount = await this.businessCategoriesService.countBusinessMedia({
        businessCategory: businessCategory._id
      });

      console.log(mediaCount);
      


      console.log(businessCategory);

      const medias = await this.businessCategoriesService.findBusinessMedias({
        query: {
          businessCategory: businessCategory?._id
        },
        options: {
          skip: skipQuery,
          limit: limitQuery
        },
        populatePaths: ['businessCategory']
      });

      // console.log(medias);
      
      

      const plainBusinessMedias =  plainToInstance(CommonBusinessMediaDTO, medias ,{
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      });

      console.log(plainBusinessMedias);
      

      return {
        list: plainBusinessMedias,
        count: mediaCount,
      };
    });
  }


  @MessagePattern({ cmd: CoreBrokerPatterns.AddBusinessMedia })
  async addBusinessMedia() {

  }
}
