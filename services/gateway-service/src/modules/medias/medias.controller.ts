import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
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
  ApiTags,
} from '@nestjs/swagger';
import {
  EntityList,
  ResponseSumType,
  IMedia,
  IMediaCategory,
  MediaCategoryType,
} from 'shared-types';
import { CreateUserTemplateMediaRequest } from '../../dtos/requests/create-user-template-media.request';
import { MediaCategoryRestDTO } from '../../dtos/response/common-media-category.dto';
import { MediasService } from './medias.service';
import { ApiFile } from '../../utils/decorators/api-file.decorator';
import { GetUserTemplateMediasQueryDto } from '../../dtos/query/GetUserTemplateMedias.dto';
import { GetMediaCategoriesQueryDto } from '../../dtos/query/GetMediaCategoriesQuery.dto';
import { UserTemplatesService } from '../user-templates/user-templates.service';
import { CreateUserTemplateMediaSwaggerProperty } from '../../dtos/swagger-properties/media.swagger-properties';
import { MEDIAS_SCOPE } from 'shared-const';
import { CommonMediaRestDto } from '../../dtos/response/common-media.dto';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { CommonResponseDto } from '../../dtos/response/common-response.dto';
import { DeleteMediasRequest } from '../../dtos/requests/delete-medias.request';
import { DeleteMediasQueryDto } from '../../dtos/query/DeleteMediasQuery.dto';

@ApiTags('Medias')
@Controller(MEDIAS_SCOPE)
export class MediasController {
  private readonly logger = new Logger();

  constructor(
    private mediaService: MediasService,
    private userTemplateService: UserTemplatesService,
  ) {}

  @Get('/categories')
  @ApiOperation({ summary: 'Get Categories' })
  @ApiOkResponse({
    type: MediaCategoryRestDTO,
    description: 'Get Categories Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getCategories(
    @Query() query: GetMediaCategoriesQueryDto,
  ): Promise<ResponseSumType<EntityList<IMediaCategory & { audio?: string }>>> {
    try {
      const { skip, limit, type } = query;

      const userTemplate = await this.userTemplateService.getUserTemplateById({
        id: query.userTemplateId,
      });

      if (!userTemplate) {
        throw new BadRequestException('User template not found');
      }

      const mediaCategories = await this.mediaService.getMediaCategories({
        skip,
        limit,
        type,
      });
      if (query.type === MediaCategoryType.Sound) {
        const mediaSoundTypeCategories = mediaCategories?.list?.map(
          async (mediaCategory) => {
            const medias = await this.mediaService.getMedias({
              categoryId: mediaCategory.id,
              userTemplateId: query.userTemplateId,
            });

            return { ...mediaCategory, audio: medias?.list[0] || null };
          },
        );

        return {
          success: true,
          result: {
            list: await Promise.all(mediaSoundTypeCategories),
            count: mediaCategories.count,
          },
        };
      }

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
  @ApiOperation({ summary: 'Get User Template Medias By Category Id' })
  @ApiOkResponse({
    type: [CommonMediaRestDto],
    description: 'Get User Template Medias',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getUserTemplateMedias(
    @Param('categoryId') categoryId: string,
    @Query() query: GetUserTemplateMediasQueryDto,
  ): Promise<ResponseSumType<EntityList<IMedia>>> {
    try {
      const { skip, limit, userTemplateId } = query;

      const medias = await this.mediaService.getMedias({
        skip,
        limit,
        categoryId,
        userTemplateId,
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

  @Post('/user-template')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create User Template Media' })
  @ApiOkResponse({
    type: CommonMediaRestDto,
    description: 'Create User Template Media',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @ApiFile(CreateUserTemplateMediaSwaggerProperty)
  async createUserTemplateMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateUserTemplateMediaRequest,
  ): Promise<ResponseSumType<IMedia>> {
    try {
      const userTemplateMedia = await this.mediaService.handleCreateMedia({
        body,
        file,
      });

      return {
        success: true,
        result: userTemplateMedia,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Delete('/')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete Medias' })
  @ApiOkResponse({
    type: CommonResponseDto,
    description: 'Delete Medias',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async deleteUserTemplateMedias(
    @Body() body: DeleteMediasRequest,
    @Query() query: DeleteMediasQueryDto,
  ): Promise<ResponseSumType<void>> {
    try {
      await this.mediaService.deleteMedias({
        ids: body.ids,
        categoryId: query.categoryId,
        userTemplateId: query.userTemplateId,
      });

      return {
        success: true,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
