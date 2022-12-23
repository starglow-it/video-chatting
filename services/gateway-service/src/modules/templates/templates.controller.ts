import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param, ParseBoolPipe,
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
import { EntityList, ResponseSumType, ICommonTemplate } from 'shared-types';
import { TemplatesService } from './templates.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { getFileNameAndExtension } from '../../utils/getFileNameAndExtension';
import { CoreService } from '../../services/core/core.service';
import { IUserTemplate, IUpdateTemplate } from 'shared-types';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { v4 as uuidv4 } from 'uuid';

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
    @Query('userId') userId: string,
    @Query('draft', ParseBoolPipe) draft: boolean,
    @Query('isPublic', ParseBoolPipe) isPublic: boolean,
    @Query('type') type: string,
  ): Promise<ResponseSumType<EntityList<ICommonTemplate>>> {
    try {
      const templatesData = await this.templatesService.getCommonTemplates({
        query: {
          ...(draft ? { draft } : {} ),
          ...(isPublic ? { isPublic } : {} ),
          ...(type ? { type } : {}),
        },
        options: {
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

  @UseGuards(JwtAuthGuard)
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
  ): Promise<ResponseSumType<ICommonTemplate>> {
    try {
      if (!templateId) {
        return {
          success: false,
        };
      }

      console.log(file);

      if (file) {
        const { fileName, extension } = getFileNameAndExtension(file.originalname);
        const isAudioFile = file.mimetype.includes('audio');

        if (isAudioFile) {
          const uploadKey = `templates/${templateId}/sounds/${uuidv4()}.${extension}`;

          await this.uploadService.deleteFolder(`templates/${templateId}/sounds`);

          const soundUrl = await this.uploadService.uploadFile(file.buffer, uploadKey);

          const soundData = await this.coreService.createTemplateSound({
            fileName: `${fileName}.${extension}`,
            mimeType: file.mimetype,
            url: soundUrl,
            size: file.size
          });

          templateData.sound = soundData.id;
        } else {
          const uploadKey = `templates/${templateId}/videos/${uuidv4()}.${extension}`;

          await this.uploadService.deleteFolder(`templates/${templateId}/videos`);

          const url = await this.uploadService.uploadFile(file.buffer, uploadKey);

          await this.coreService.uploadTemplateFile({
            url,
            id: templateId,
            mimeType: file.mimetype,
            fileName,
            uploadKey: `templates/${templateId}`,
          });
        }
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
      if (templateId) {
        const template = await this.templatesService.getCommonTemplateById({
          templateId,
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

  @UseGuards(JwtAuthGuard)
  @Delete('/:templateId/sound')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Template Sound' })
  @ApiOkResponse({
    description: 'Delete Common Template Sound Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async deleteCommonTemplateSound(
    @Request() req,
    @Param('templateId') templateId: string,
  ) {
    try {
      if (templateId) {
        await this.uploadService.deleteFolder(`templates/${templateId}/sounds`);

        await this.templatesService.updateTemplate({
          templateId,
          data: {
            sound: null,
          },
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
