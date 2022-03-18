import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

// dtos
import { CommonTemplateRestDTO } from '../dtos/response/common-template.dto';

// services
import { NotificationsService } from '../notifications/notifications.service';
import { CoreService } from '../core/core.service';
import { ConfigClientService } from '../config/config.service';
import { TemplatesService } from '../templates/templates.service';

@Controller('users/templates')
export class UserTemplateController {
  private readonly logger = new Logger();

  constructor(
    private configService: ConfigClientService,
    private notificationService: NotificationsService,
    private coreService: CoreService,
    private templatesService: TemplatesService,
  ) {}

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
}
