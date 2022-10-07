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
import { ResponseSumType } from '@shared/response/common.response';
import { EntityList } from '@shared/types/utils/http/list.type';
import { IBusinessCategory } from '@shared/interfaces/business-category.interface';
import { CoreService } from '../../services/core/core.service';
import { CategoryRestDTO } from '../../dtos/response/common-category.dto';

@Controller('categories')
export class CategoriesController {
  private readonly logger = new Logger();

  constructor(private coreService: CoreService) {}

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
      const templatesData = await this.coreService.getBusinessCategories({
        skip,
        limit,
      });

      return {
        success: true,
        result: templatesData,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get common templates`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }
}
