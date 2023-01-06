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
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';

import { IUserTemplate, ResponseSumType, EntityList } from 'shared-types';

import { JwtAuthGuard } from '../../guards/jwt.guard';

import { CommonTemplateRestDTO } from '../../dtos/response/common-template.dto';
import { UpdateTemplateRequest } from '../../dtos/requests/update-template.request';

import { TemplatesService } from '../templates/templates.service';
import { UserTemplatesService } from '../user-templates/user-templates.service';
import { UploadService } from '../upload/upload.service';

import { getFileNameAndExtension } from '../../utils/getFileNameAndExtension';

@Controller('profile/templates')
export class ProfileTemplatesController {
  private readonly logger = new Logger();

  constructor(
    private templatesService: TemplatesService,
    private userTemplatesService: UserTemplatesService,
    private uploadService: UploadService,
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
      const template = await this.userTemplatesService.getUserTemplates({
        userId: req.user.userId,
        skip,
        limit,
        sort: 'usedAt',
        direction: -1,
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
  @Get('/count')
  @ApiOperation({ summary: 'Get Profile Rooms Count' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get Profile Rooms Success',
  })
  async getProfileTemplatesCount(
    @Request() req,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('templateType') templateType: string,
  ): Promise<ResponseSumType<{ count: number }>> {
    try {
      const count = await this.userTemplatesService.countUserTemplates({
        userId: req.user.userId,
        options: {
          skip,
          limit,
          templateType,
        },
      });

      return {
        success: true,
        result: count,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get profile templates count`,
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
  async updateProfileTemplate(
    @Request() req,
    @Body() updateTemplateData: UpdateTemplateRequest,
    @Param('templateId') templateId: IUserTemplate['id'],
  ): Promise<ResponseSumType<IUserTemplate>> {
    try {
      if (!templateId) {
        return {
          success: false,
        };
      }

      const userTemplate = await this.userTemplatesService.updateUserTemplate({
        templateId,
        userId: req.user.userId,
        data: updateTemplateData,
      });

      return {
        success: true,
        result: userTemplate,
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
        await this.userTemplatesService.deleteUserTemplate({
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
        const template = await this.userTemplatesService.getUserTemplate({
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
          await this.userTemplatesService.getUserTemplateByTemplateId({
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

  @UseGuards(JwtAuthGuard)
  @Post('/add/:templateId')
  @ApiOperation({ summary: 'Add Template to profile' })
  @ApiOkResponse({
    description: 'Add template to profile',
  })
  async addTemplateToProfile(
    @Req() req,
    @Param('templateId') templateId: string,
  ) {
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

      if (!template) {
        return {
          success: false,
          result: null,
        };
      }

      let userTemplate =
          await this.userTemplatesService.getUserTemplateByTemplateId({
            id: template.templateId,
            userId: req.user.userId,
          });

      if (!userTemplate) {
        userTemplate = await this.templatesService.addTemplateToUser({
          templateId: template.id,
          userId: req.user.userId,
        });
      }

      return {
        success: true,
        result: userTemplate,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while add template to user`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:templateId/background')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload Template Background' })
  @ApiOkResponse({
    description: 'Upload Profile Template Background Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @UseInterceptors(
      FileInterceptor('file', {
        preservePath: true,
      }),
  )
  async uploadProfileTemplateBackground(
      @Request() req,
      @Query('updateKey') updateKey: string,
      @Param('templateId') templateId: string,
      @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!templateId || !file) {
        return {
          success: false,
        };
      }

      const userTemplate = await this.userTemplatesService.getUserTemplateById({ id: templateId });

      const { fileName, extension } = getFileNameAndExtension(
          file.originalname,
      );

      const uploadKey = `templates/${templateId}/videos/${uuidv4()}.${extension}`;

      if (updateKey === 'url') {
        const oldKey = this.uploadService.getUploadKeyFromUrl(userTemplate.url);

        this.uploadService.deleteResource(oldKey);
      }

      const url = await this.uploadService.uploadFile(file.buffer, uploadKey);

      const updatedTemplate = await this.userTemplatesService.uploadUserTemplateFile({
        url,
        id: templateId,
        mimeType: file.mimetype,
        fileName,
        uploadKey,
      });

      return {
        success: true,
        result: updatedTemplate,
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
