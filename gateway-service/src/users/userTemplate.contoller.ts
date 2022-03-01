import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { CoreService } from '../core/core.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ConfigClientService } from '../config/config.service';
import { TemplatesService } from '../templates/templates.service';
import { CommonTemplateRestDTO } from '../dtos/response/common-template.dto';
import { UpdateTemplateRequest } from '../dtos/requests/update-template.request';
import { ResponseSumType } from '@shared/response/common.response';
import { ICommonTemplate } from '@shared/interfaces/common-template.interface';
import { EntityList } from '@shared/types/utils/http/list.type';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';

@Controller('users/:userId/templates')
export class UserTemplateController {
  private readonly logger = new Logger();
  constructor(
    private configService: ConfigClientService,
    private notificationService: NotificationsService,
    private coreService: CoreService,
    private templatesService: TemplatesService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Get Profile Templates' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get Profile Templates Success',
  })
  async getUserTemplates(
    @Param('userId') userId: string,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<ResponseSumType<EntityList<IUserTemplate>>> {
    try {
      if (userId) {
        const template = await this.templatesService.getUserTemplates({
          userId,
          skip,
          limit,
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
          message: `An error occurs, while get profile templates`,
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

  @Post('/:templateId')
  @ApiOperation({ summary: 'Update Profile Template' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Update Profile Template Success',
  })
  async updateUserTemplate(
    @Body() updateTemplateData: UpdateTemplateRequest,
    @Param('templateId') templateId: ICommonTemplate['id'],
  ): Promise<ResponseSumType<ICommonTemplate>> {
    try {
      if (templateId) {
        const template = await this.templatesService.updateUserTemplate({
          templateId,
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
}
