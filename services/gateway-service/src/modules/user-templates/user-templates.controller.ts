import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
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

import { UserTemplatesService } from './user-templates.service';
import { UploadService } from '../upload/upload.service';
import { CoreService } from '../../services/core/core.service';

// dtos
import { CommonTemplateRestDTO } from '../../dtos/response/common-template.dto';

// guards
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFileNameAndExtension } from '../../utils/getFileNameAndExtension';
import { v4 as uuidv4 } from 'uuid';
import { IUpdateTemplate } from 'shared-types';
import { USER_TEMPLATE_SCOPE } from 'shared-const';

@Controller(USER_TEMPLATE_SCOPE)
export class UserTemplatesController {
  private readonly logger = new Logger();
  constructor(
    private userTemplatesService: UserTemplatesService,
    private uploadService: UploadService,
    private coreService: CoreService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Users Templates except target user' })
  @ApiOkResponse({
    description: 'Fetch users templates succeeded',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getUsersTemplates(
    @Request() req,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort') sort: string,
    @Query('dir') direction: number,
  ) {
    try {
      const templatesData = await this.userTemplatesService.getUsersTemplates({
        userId: req.user.userId,
        skip,
        limit,
        sort,
        direction,
      });

      return {
        success: true,
        result: templatesData,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get users templates`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Get('/:templateId')
  @ApiOperation({ summary: 'Get User Template' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get User Template Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getUserTemplateById(@Param('templateId') templateId: string) {
    try {
      if (templateId) {
        const template = await this.userTemplatesService.getUserTemplateById({
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
          message: `An error occurs, while get user template by id`,
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
  async updateUserTemplate(
    @Request() req,
    @Param('templateId') templateId: string,
    @Body() templateData: Partial<IUpdateTemplate>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!templateId) {
        return {
          success: false,
        };
      }

      let userTemplate = await this.userTemplatesService.getUserTemplateById({
        id: templateId,
      });

      if (file) {
        const { extension } = getFileNameAndExtension(file.originalname);

        const uploadKey = `templates/${templateId}/videos/${uuidv4()}.${extension}`;

        await this.uploadService.deleteFolder(`templates/${templateId}/videos`);

        const url = await this.uploadService.uploadFile(file.buffer, uploadKey);

        userTemplate = await this.coreService.uploadUserTemplateFile({
          url,
          id: templateId,
          mimeType: file.mimetype,
        });
      }

      if (Object.keys(templateData).length >= 1) {
        userTemplate = await this.userTemplatesService.updateUserTemplate({
          templateId,
          userId: req.user.userId,
          data: templateData,
        });
      }

      return {
        success: true,
        result: userTemplate,
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
}
