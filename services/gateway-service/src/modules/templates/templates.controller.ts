import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CommonTemplateRestDTO } from '../../dtos/response/common-template.dto';
import {
  EntityList,
  ResponseSumType,
  ICommonTemplate,
  RoomType,
} from 'shared-types';
import { TemplatesService } from './templates.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { getFileNameAndExtension } from '../../utils/getFileNameAndExtension';
import { CoreService } from '../../services/core/core.service';
import { IUserTemplate, IUpdateTemplate } from 'shared-types';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { v4 as uuidv4 } from 'uuid';
import { GetTemplatesQueryDto } from '../../dtos/query/GetTemplatesQuery.dto';
import { UpdateTemplateRequest } from 'src/dtos/requests/update-template.request';

@ApiTags('Common Templates')
@Controller('templates')
export class TemplatesController {
  private readonly logger = new Logger();
  constructor(
    private templatesService: TemplatesService,
    private uploadService: UploadService,
    private coreService: CoreService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Get Templates' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get Templates Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getCommonTemplates(
    @Query() query: GetTemplatesQueryDto,
  ): Promise<ResponseSumType<EntityList<ICommonTemplate>>> {
    try {
      const {
        skip,
        limit,
        userId,
        draft,
        isPublic,
        roomType,
        businessCategories,
        type,
        sort,
        isHaveSubdomain,
        direction,
      } = query;

      const templatesData = await this.templatesService.getCommonTemplates({
        query: {
          isDeleted: false,
          ...(draft !== undefined && { draft }),
          ...(isPublic !== undefined && { isPublic }),
          ...(type && { type }),
          roomType,
          businessCategories,
          subdomain: isHaveSubdomain ? { $ne: '' } : '',
          isAcceptNoLogin: false,
        },
        options: {
          ...(sort ? { sort: { [sort]: direction } } : {}),
          skip,
          limit,
          userId,
        },
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

  @UseGuards(JwtAuthGuard)
  @Post('/add/featured')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Featured Template' })
  @ApiOkResponse({
    description: 'Create Featured Template',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async createFeaturedTemplate(
    @Request() req,
  ): Promise<ResponseSumType<ICommonTemplate>> {
    try {
      const templateData = await this.templatesService.createTemplate({
        userId: req.user.userId,
        roomType: RoomType.Featured,
      });

      return {
        success: true,
        result: templateData,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while create featured template`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Template' })
  @ApiOkResponse({
    description: 'Create Template',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async postCreateTemplate(
    @Request() req,
  ): Promise<ResponseSumType<ICommonTemplate>> {
    try {
      const templateData = await this.templatesService.createTemplate({
        userId: req.user.userId,
      });

      return {
        success: true,
        result: templateData,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while create template`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Put('/:templateId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Template' })
  @ApiOkResponse({
    description: 'Update Template',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      preservePath: true,
    }),
  )
  async editTemplate(
    @Param('templateId') templateId: string,
    @Body() templateData: UpdateTemplateRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseSumType<ICommonTemplate>> {
    try {
      if (!templateId) {
        return {
          success: false,
        };
      }

      if (file) {
        const { extension } = getFileNameAndExtension(file.originalname);
        const uploadKey = `templates/videos/${templateId}/${uuidv4()}.${extension}`;

        let url = await this.uploadService.uploadFile(file.buffer, uploadKey);

        if (!/^https:\/\/*/.test(url)) {
          url = `https://${url}`;
        }

        await this.coreService.uploadTemplateFile({
          url,
          id: templateId,
          mimeType: file.mimetype,
        });
      }

      if (Object.keys(templateData).length >= 1) {
        await this.templatesService.updateTemplate({
          templateId,
          data: templateData,
        });
      }

      const template = await this.templatesService.getCommonTemplateById({
        templateId,
      });

      return {
        success: true,
        result: template,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while update template`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Get('/:templateId')
  @ApiOperation({ summary: 'Get Template' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get Common Template Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getCommonTemplate(@Param('templateId') templateId: string) {
    try {
      if (!templateId) {
        return {
          success: false,
          result: null,
        };
      }

      const template = await this.templatesService.getCommonTemplateById({
        templateId,
      });

      return {
        success: true,
        result: template,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get common template`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:templateId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Template' })
  @ApiOkResponse({
    description: 'Delete Common Template Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async deleteCommonTemplate(
    @Request() req,
    @Param('templateId') templateId: string,
  ) {
    try {
      if (templateId) {
        await this.templatesService.deleteCommonTemplate({
          templateId,
        });

        return {
          success: true,
        };
      }
      return {
        success: false,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while delete common template`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }
}
