import {
  Controller,
  Post,
  UseGuards,
  Request,
  BadRequestException,
  Logger,
  Param,
  Get,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../guards/jwt.guard';
import { CommonInstanceMeetingRestDTO } from '../../dtos/response/common-instance-meeting.dto';

import { MEETINGS_SCOPE } from '@shared/const/api-scopes.const';
import { ResponseSumType } from '@shared/response/common.response';

import { CoreService } from '../../services/core/core.service';
import { MediaServerService } from '../../services/media-server/media-server.service';
import { TemplatesService } from '../templates/templates.service';
import { ScalingService } from '../../services/scaling/scaling.service';
import { ConfigClientService } from '../../services/config/config.service';

import { CreateMeetingRequest } from '../../dtos/requests/create-meeting.request';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import { GetMeetingTokenRequest } from '../../dtos/requests/get-meeting-token.request';

@Controller(MEETINGS_SCOPE)
export class MeetingsController {
  private readonly logger = new Logger();
  private supportScaling: boolean;

  constructor(
    private coreService: CoreService,
    private templatesService: TemplatesService,
    private mediaServerService: MediaServerService,
    private scalingService: ScalingService,
    private configService: ConfigClientService,
  ) {}

  async onModuleInit() {
    this.supportScaling = await this.configService.get<boolean>(
      'supportScaling',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Meeting' })
  @ApiOkResponse({
    type: CommonInstanceMeetingRestDTO,
    description: 'Create Meeting Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async createMeeting(
    @Request() req,
    @Body() body: CreateMeetingRequest,
  ): Promise<ResponseSumType<IUserTemplate>> {
    try {
      let userTemplate = await this.templatesService.getUserTemplateById({
        id: body.templateId,
      });

      if (!userTemplate) {
        userTemplate = await this.templatesService.createUserTemplate({
          id: body.templateId,
          userId: req.user.userId,
        });
      }

      const updatedUserTemplate = await this.coreService.assignMeetingInstance({
        userId: req.user.userId,
        templateId: userTemplate.id,
      });

      if (this.supportScaling) {
        this.scalingService.createServerInstance({});
      }

      return {
        success: true,
        result: updatedUserTemplate,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while create meeting`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Get('/:meetingId')
  @ApiOperation({ summary: 'Get Meeting' })
  @ApiOkResponse({
    type: CommonInstanceMeetingRestDTO,
    description: 'Get Meeting Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getMeeting(@Param('meetingId') meetingId: string) {
    try {
      const meeting = await this.coreService.findMeetingById({ meetingId });

      return {
        success: true,
        result: meeting,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get meeting`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Post('/token')
  @ApiOperation({ summary: 'Get media server token' })
  @ApiOkResponse({
    type: '',
    description: 'Get Media Server Token Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getMediaServerToken(@Body() body: GetMeetingTokenRequest) {
    try {
      const result = await this.mediaServerService.getMediaServerToken(body);

      if (!result?.result) {
        return {
          success: false,
        };
      }

      return {
        success: true,
        result: result?.result,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get media server token`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }
}
