import { Controller } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { InjectConnection } from '@nestjs/mongoose';

//  const
import { BUSINESS_CATEGORIES_SERVICE } from 'shared';
import { CoreBrokerPatterns } from 'shared';

// types
import { EntityList } from 'shared';
import { IBusinessCategory } from 'shared';
import { GetBusinessCategoriesPayload } from 'shared';

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
}
