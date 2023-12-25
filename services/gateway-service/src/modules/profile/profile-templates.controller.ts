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
  UpdateTemplatePaymentsData,
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
import { TemplateIdParam } from '../../dtos/params/template-id.params';
import { UpdateTemplatePaymentsRequest } from '../../dtos/requests/update-template-payment.request';
import { UserId } from '../../utils/decorators/user-id.decorator';
import { CommonTemplatePaymentDto } from '../../dtos/response/common-template-payment.dto';
import { GetProfileTemplatesQueryDto } from '../../dtos/query/get-profile-templates.query';
import { TemplatesModule } from '../templates/templates.module';
import { UpdateUserTemplateRequest } from 'src/dtos/requests/update-user-template.request';

@ApiTags('Profile/Templates')
@Controller('profile/templates')
export class ProfileTemplatesController {
  private readonly logger = new Logger();

  constructor(
    private templatesService: TemplatesService,
    private userTemplatesService: UserTemplatesService,
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
    @Query() { skip, limit, categoryType }: GetProfileTemplatesQueryDto,
  ): Promise<ResponseSumType<EntityList<IUserTemplate>>> {
    try {
      const templates = await this.userTemplatesService.getUserTemplates({
        userId: req.user.userId,
        categoryType,
        skip,
        limit,
        sort: 'usedAt',
        direction: -1,
      });

      return {
        success: true,
        result: templates,
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
    @Body() updateTemplateData: UpdateUserTemplateRequest,
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
  @ApiOperation({ summary: 'Get Detail Template' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get Detail Profile Template Success',
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

  @Get('/:templateId/payments')
  @ApiOperation({ summary: 'Get Detail Template' })
  @ApiOkResponse({
    type: [CommonTemplatePaymentDto],
    description: 'Get Detail Profile Template Success',
  })
  async getTemplatePayments(@Param() { templateId }: TemplateIdParam) {
    try {
      return await this.coreService.getTemplatePayments({
        userTemplateId: templateId,
      });
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get template payments`,
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
  @Patch('/:templateId/payment')
  @ApiOperation({ summary: 'Update User Template Payment' })
  @ApiOkResponse({
    description: 'Update user template payment',
  })
  async updatePaymentForUserTemplate(
    @UserId() userId: string,
    @Param() { templateId }: TemplateIdParam,
    @Body() body: UpdateTemplatePaymentsRequest,
  ) {
    try {
      const promise = Object.values(body).map(async (paymentValue) => {
        return Object.values(paymentValue).map(async (value) => {
          return await checkValidCurrency({
            currency: value['currency'] as string,
            amount: value['price'] as number,
          });
        });
      });

      await Promise.all(promise);

      return await this.coreService.updateTemplatePayment({
        data: body as UpdateTemplatePaymentsData,
        userId,
        userTemplateId: templateId,
      });
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while update template payments for user`,
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
    @Param() { templateId }: TemplateIdParam,
  ): Promise<ResponseSumType<IUserTemplate>> {
    try {
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
        userTemplate = await this.coreService.addTemplateToUser({
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
}
