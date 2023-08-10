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
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonTemplateRestDTO } from '../../dtos/response/common-template.dto';
import { UpdateTemplateRequest } from '../../dtos/requests/update-template.request';
import {
  IUserTemplate,
  ResponseSumType,
  EntityList,
  ICommonTemplate,
} from 'shared-types';
import { TemplatesService } from '../templates/templates.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFileNameAndExtension } from '../../utils/getFileNameAndExtension';
import { UploadService } from '../upload/upload.service';
import { CoreService } from '../../services/core/core.service';
import { v4 as uuidv4 } from 'uuid';
import { UserTemplatesService } from '../user-templates/user-templates.service';
import { JwtAuthAnonymousGuard } from '../../guards/jwt-anonymous.guard';
import { checkValidCurrency } from '../../utils/stripeHelpers/checkValidCurrency';

@ApiTags('Profile/Templates')
@Controller('profile/templates')
export class ProfileTemplatesController {
  private readonly logger = new Logger();

  constructor(
    private templatesService: TemplatesService,
    private userTemplatesService: UserTemplatesService,
    private uploadService: UploadService,
    private coreService: CoreService,
  ) { }

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

  @UseGuards(JwtAuthAnonymousGuard)
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
  ): Promise<ResponseSumType<IUserTemplate>> {
    try {
      if (templateId) {
        if (file) {
          const { extension } = getFileNameAndExtension(file.originalname);
          const uploadKey = `templates/videos/${templateId}/${uuidv4()}.${extension}`;

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

        const { paywallCurrency, paywallPrice, templateCurrency, templatePrice } = updateTemplateData;
        if (templatePrice) {
          await checkValidCurrency({
            amount: templatePrice,
            currency: templateCurrency
          });
        }

        if (paywallPrice) {
          await checkValidCurrency({
            amount: paywallPrice,
            currency: paywallCurrency
          });
        }

        const template = await this.userTemplatesService.updateUserTemplate({
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

  @UseGuards(JwtAuthAnonymousGuard)
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
      if (templateId) {
        const template = await this.templatesService.getCommonTemplateById({
          templateId,
        });

        if (template) {
          let userTemplate =
            await this.userTemplatesService.getUserTemplateByTemplateId({
              id: template.templateId,
              userId: req.user.userId,
            });

          if (!userTemplate) {
            userTemplate = await this.coreService.addTemplateToUser({
              templateId: template.id,
              userId: req.user.userId,
            });
          }

          return {
            success: true,
            result: userTemplate,
          };
        }

        return {
          success: false,
          result: null,
        };
      }

      return {
        success: false,
        result: null,
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
}
