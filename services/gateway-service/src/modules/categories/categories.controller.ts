import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  ParseIntPipe,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { EntityList, ResponseSumType, IBusinessCategory } from 'shared-types';
import { CategoryRestDTO } from '../../dtos/response/common-category.dto';
import {CategoriesService} from "./categories.service";

@Controller('categories')
export class CategoriesController {
  private readonly logger = new Logger();

  constructor(
      private categoriesService: CategoriesService
  ) {}

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
      const businessCategories = await this.categoriesService.getBusinessCategories({
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
}
