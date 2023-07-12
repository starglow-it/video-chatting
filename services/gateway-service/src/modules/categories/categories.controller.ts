import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { EntityList, ResponseSumType, IBusinessCategory } from 'shared-types';
import { CategoryRestDTO } from '../../dtos/response/common-category.dto';
import { CategoriesService } from './categories.service';
import { CreateUserTemplateMediaRequest } from 'src/dtos/requests/create-user-template-media.request';
import { UpdateBusinessCategoryRequest } from 'src/dtos/requests/update-business-category.request';
import { CommonResponseDto } from 'src/dtos/response/common-response.dto';
import { UpdateBusinessCategoryParam } from 'src/dtos/params/update-business-category.param';
import { JwtAdminAuthGuard } from 'src/guards/jwt-admin.guard';
import { DeleteBusinessCategoriesRequest } from 'src/dtos/requests/delete-business-categories.request';

@Controller('categories')
export class CategoriesController {
  private readonly logger = new Logger();

  constructor(private categoriesService: CategoriesService) { }

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


  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({ summary: 'Update Business Category' })
  @ApiOkResponse({
    type: CommonResponseDto,
    description: 'Update Bussiness Category',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async updateBusinessCategory(
    @Param() {id}: UpdateBusinessCategoryParam,
    @Body() body: UpdateBusinessCategoryRequest
  ): Promise<ResponseSumType<void>> {
    try {
      await this.categoriesService.updateBusinessCategory({
        id,
        data: body
    });

    return {
        success: true,
        result: null
    }
    }
    catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Delete('/')
  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({ summary: 'Delete Business Categories' })
  @ApiOkResponse({
      type: CommonResponseDto,
      description: 'Delete Business Categories',
  })
  @ApiForbiddenResponse({
      description: 'Forbidden',
  })
  async deleteMediaCategories(@Body() {ids}: DeleteBusinessCategoriesRequest): Promise<ResponseSumType<void>> {
      try {
          await this.categoriesService.deleteBusinessCategories({
              ids
          });

          return {
              success: true
          }
      }
      catch (err) {
          throw new BadRequestException(err);
      }
  }
}
