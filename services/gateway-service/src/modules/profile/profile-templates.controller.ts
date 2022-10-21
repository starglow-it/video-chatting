import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CommonTemplateRestDTO } from '../../dtos/response/common-template.dto';
import { IUserTemplate } from 'shared';
import { ResponseSumType } from 'shared';
import { UpdateTemplateRequest } from '../../dtos/requests/update-template.request';
import { ICommonTemplate } from 'shared';
import { EntityList } from 'shared';
import { TemplatesService } from '../templates/templates.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFileNameAndExtension } from '../../utils/getFileNameAndExtension';
import { UploadService } from '../upload/upload.service';
import { CoreService } from '../../services/core/core.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('profile/templates')
export class ProfileTemplatesController {
  private readonly logger = new Logger();

  constructor(
    private templatesService: TemplatesService,
    private uploadService: UploadService,
    private coreService: CoreService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiOperation({ summary: 'Get Profile Rooms' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get Profile Rooms Success',
  })
  async getProfileTemplates(
    @Request() req,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<ResponseSumType<EntityList<IUserTemplate>>> {
    try {
      const template = await this.templatesService.getUserTemplates({
        userId: req.user.userId,
        skip,
        limit,
      });

      return {
        success: true,
        result: template,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get profile templates`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:templateId')
  @ApiOperation({ summary: 'Update Profile Template' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Update Profile Template Success',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      preservePath: true,
    }),
  )
  async updateProfileTemplate(
    @Request() req,
    @Body() updateTemplateData: UpdateTemplateRequest,
    @Param('templateId') templateId: ICommonTemplate['id'],
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseSumType<ICommonTemplate>> {
    try {
      if (templateId) {
        if (file) {
          const { extension } = getFileNameAndExtension(file.originalname);
          const uploadKey = `templates/videos/${templateId}/${uuidv4()}.${extension}`;

          await this.uploadService.deleteFolder(
            `templates/videos/${templateId}`,
          );

          const url = await this.uploadService.uploadFile(
            file.buffer,
            uploadKey,
          );

          await this.coreService.uploadProfileTemplateFile({
            url,
            id: templateId,
            mimeType: file.mimetype,
          });
        }

        const template = await this.templatesService.updateUserTemplate({
          templateId,
          userId: req.user.userId,
          data: updateTemplateData,
        });

        return {
          success: true,
          result: template,
        };
      }
      return {
        success: false,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while update profile template`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:templateId')
  @ApiOperation({ summary: 'Delete Profile Template' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Delete Profile Template Success',
  })
  async deleteUserTemplate(
    @Param('templateId') templateId: IUserTemplate['id'],
    @Request() req,
  ): Promise<ResponseSumType<void>> {
    try {
      if (templateId) {
        await this.templatesService.deleteUserTemplate({
          templateId,
          userId: req.user.userId,
        });

        return {
          success: true,
          result: undefined,
        };
      }
      return {
        success: false,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while delete profile template`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:templateId')
  @ApiOperation({ summary: 'Get Template' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get Profile Template Success',
  })
  async getUserTemplate(@Param('templateId') templateId: string) {
    try {
      if (templateId) {
        const template = await this.templatesService.getUserTemplate({
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
          message: `An error occurs, while get profile template`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/id/:templateId')
  @ApiOperation({ summary: 'Get Template by template id' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get Profile Template Success',
  })
  async getUserTemplateByTemplateId(
    @Request() req,
    @Param('templateId', ParseIntPipe)
    templateId: number,
  ) {
    try {
      if (templateId) {
        const template =
          await this.templatesService.getUserTemplateByTemplateId({
            id: templateId,
            userId: req.user.userId,
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
          message: `An error occurs, while get profile template`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }
}
