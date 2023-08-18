import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  EntityList,
  IMedia,
  IMediaCategory,
  ResponseSumType,
} from 'shared-types';
import { MediasService } from './medias.service';
import { UploadService } from '../upload/upload.service';
import { ApiFile } from '../../utils/decorators/api-file.decorator';
import { JwtAdminAuthGuard } from '../../guards/jwt-admin.guard';
import { CreateMediaCategoryRequest } from '../../dtos/requests/create-media-category.request';
import { CreateMediaSwaggerProperty } from '../../dtos/swagger-properties/media.swagger-properties';
import { UpdateMediaCategoryRequest } from '../../dtos/requests/update-media-category.request';
import { CommonResponseDto } from '../../dtos/response/common-response.dto';
import { DeleteMediasRequest } from '../../dtos/requests/delete-medias.request';
import { DeleteMediasParam } from '../../dtos/params/delete-medias.param';
import { MediaCategoryRestDTO } from '../../dtos/response/common-media-category.dto';
import { GetAdminMediaCategoriesQueryDto } from '../../dtos/query/GetAdminMediaCategoriesQuery.dto';
import { DeleteMediaCategoriesRequest } from '../../dtos/requests/delete-media-categories.request';
import { MediaCategoryParam } from 'src/dtos/params/update-media.param';
import { CreateMediaRequest } from 'src/dtos/requests/create-media.request';
import { CommonMediaRestDto } from 'src/dtos/response/common-media.dto';
import { GetMediasQueryDto } from 'src/dtos/query/GetAdminMediasQuery.dto';
import { MEDIAS_ADMIN_SCOPE } from 'shared-const';

@ApiTags('Admin Medias')
@Controller(MEDIAS_ADMIN_SCOPE)
export class AdminMediasController {
  private readonly logger = new Logger();

  constructor(private mediaService: MediasService) {}

  @Get('/categories')
  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({ summary: 'Get Categories' })
  @ApiOkResponse({
    type: MediaCategoryRestDTO,
    description: 'Get Categories Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getCategories(
    @Query() query: GetAdminMediaCategoriesQueryDto,
  ): Promise<ResponseSumType<EntityList<IMediaCategory>>> {
    try {
      const { skip, limit, type } = query;

      const mediaCategories = await this.mediaService.getAdminMediaCategories({
        skip,
        limit,
        type,
      });

      return {
        success: true,
        result: mediaCategories,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get media categories`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Get('/:categoryId')
  @ApiOperation({ summary: 'Get Medias By Category Id' })
  @ApiOkResponse({
    type: [CommonMediaRestDto],
    description: 'Get Medias',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getUserTemplateMedias(
    @Param('categoryId') categoryId: string,
    @Query() query: GetMediasQueryDto,
  ): Promise<ResponseSumType<EntityList<IMedia>>> {
    try {
      const { skip, limit } = query;
      const medias = await this.mediaService.getMedias({
        categoryId,
        skip,
        limit,
      });

      return {
        success: true,
        result: medias,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get medias`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Post('/category')
  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Media Category' })
  @ApiOkResponse({
    type: CommonResponseDto,
    description: 'Create Media Category',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async createCategory(
    @Body() body: CreateMediaCategoryRequest,
  ): Promise<ResponseSumType<IMediaCategory>> {
    try {
      const category = await this.mediaService.createMediaCategory(body);
      return {
        success: true,
        result: category,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Media' })
  @ApiOkResponse({
    type: CommonMediaRestDto,
    description: 'Create Media',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @ApiFile(CreateMediaSwaggerProperty)
  async createMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateMediaRequest,
  ): Promise<ResponseSumType<IMedia>> {
    try {
      const media = await this.mediaService.handleCreateMedia({
        file,
        body,
      });
      return {
        success: true,
        result: media,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Patch('/category/:categoryId')
  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Media Category' })
  @ApiOkResponse({
    type: CommonResponseDto,
    description: 'Update Media Category',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async updateMedia(
    @Param() param: MediaCategoryParam,
    @Body() body: UpdateMediaCategoryRequest,
  ): Promise<ResponseSumType<void>> {
    try {
      await this.mediaService.updateMediaCategory({
        id: param.categoryId,
        data: body,
      });

      return {
        success: true,
        result: null,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Delete('/categories')
  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({ summary: 'Delete Media Categories' })
  @ApiOkResponse({
    type: CommonResponseDto,
    description: 'Delete Media Categories',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async deleteMediaCategories(
    @Body() body: DeleteMediaCategoriesRequest,
  ): Promise<ResponseSumType<void>> {
    try {
      await this.mediaService.deleteMediaCategories({
        ids: body.ids,
      });

      return {
        success: true,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Delete('/:categoryId')
  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({ summary: 'Delete Medias' })
  @ApiOkResponse({
    type: CommonResponseDto,
    description: 'Delete Medias',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async deleteMedias(
    @Body() body: DeleteMediasRequest,
    @Param() params: DeleteMediasParam,
  ): Promise<ResponseSumType<void>> {
    try {
      await this.mediaService.deleteMedias({
        ids: body.ids,
        categoryId: params.categoryId,
        userTemplateId: null,
      });

      return {
        success: true,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
