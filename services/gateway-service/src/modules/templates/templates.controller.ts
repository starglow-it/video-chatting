import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
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
} from '@nestjs/swagger';
import { CommonTemplateRestDTO } from '../../dtos/response/common-template.dto';
import { ResponseSumType } from '@shared/response/common.response';
import { ICommonTemplate } from '@shared/interfaces/common-template.interface';
import { EntityList } from '@shared/types/utils/http/list.type';
import { TemplatesService } from './templates.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { getFileNameAndExtension } from '../../utils/getFileNameAndExtension';
import { CoreService } from '../../services/core/core.service';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { IUpdateTemplate } from '@shared/interfaces/update-template.interface';

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
    @Request() req,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<ResponseSumType<EntityList<ICommonTemplate>>> {
    try {
      const templatesData = await this.templatesService.getCommonTemplates({
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
  ): Promise<ResponseSumType<IUserTemplate>> {
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
    @Request() req,
    @Param('templateId') templateId: string,
    @Body() templateData: Partial<IUpdateTemplate>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseSumType<any>> {
    try {
      if (!templateId) {
        return {
          success: false,
        };
      }

      if (file) {
        const { fileName, extension } = getFileNameAndExtension(
          file.originalname,
        );
        const uploadKey = `templates/videos/${templateId}/${fileName}.${extension}`;

        await this.uploadService.deleteFolder(`templates/videos/${templateId}`);

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

      if (Object.keys(templateData).length > 1) {
        await this.templatesService.updateTemplate({
          templateId,
          data: templateData,
        });
      }

      const template = await this.templatesService.getCommonTemplateById({
        id: templateId,
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
      if (templateId) {
        const template = await this.templatesService.getCommonTemplateById({
          id: templateId,
        });

        return {
          success: true,
          result: template,
        };
      }
      return {
        success: false,
        result: null,
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
}
