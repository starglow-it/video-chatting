import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EntityList, ResponseSumType, IBusinessCategory, IBusinessMedia } from 'shared-types';
import { BusinessMediaRestDTO } from 'src/dtos/response/common-business-media.dto';
import { CategoryRestDTO } from '../../dtos/response/common-category.dto';
import { CategoriesService } from './categories.service';

@ApiTags('Business Category')
@Controller('categories')
export class CategoriesController {
  private readonly logger = new Logger();

  constructor(private categoriesService: CategoriesService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get Categories' })
  @ApiOkResponse({
    type: CategoryRestDTO,
    description: 'Get Categories Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getCategories(
    @Request() req,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<ResponseSumType<EntityList<IBusinessCategory>>> {
    try {
      const businessCategories =
        await this.categoriesService.getBusinessCategories({
          skip,
          limit,
        });

      return {
        success: true,
        result: businessCategories,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get business categories`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }


  @Get('medias/:categoryId')
  @ApiOperation({ summary: 'Get Business medias' })
  @ApiOkResponse({
    type: [BusinessMediaRestDTO],
    description: 'Get Business Medias',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getBusinessMeidas(
    @Param('categoryId') categoryId: string,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<ResponseSumType<EntityList<IBusinessMedia>>> {
    try {
      const businessMedias =
        await this.categoriesService.getBusinessMedias({
          skip,
          limit,
          businessCategoryId: categoryId
        });

      return {
        success: true,
        result: businessMedias,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get business categories`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }
}
