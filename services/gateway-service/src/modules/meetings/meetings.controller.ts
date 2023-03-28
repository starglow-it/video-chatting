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

import { MEETINGS_SCOPE } from 'shared-const';
import { ResponseSumType, IUserTemplate } from 'shared-types';

// services
import { CoreService } from '../../services/core/core.service';
import { MediaServerService } from '../../services/media-server/media-server.service';
import { TemplatesService } from '../templates/templates.service';
import { UserTemplatesService } from '../user-templates/user-templates.service';

// requests
import { CreateMeetingRequest } from '../../dtos/requests/create-meeting.request';
import { GetMeetingTokenRequest } from '../../dtos/requests/get-meeting-token.request';

// dtos
import { CommonInstanceMeetingRestDTO } from '../../dtos/response/common-instance-meeting.dto';
import { MeetingsService } from './meetings.service';

@Controller(MEETINGS_SCOPE)
export class MeetingsController {
  private readonly logger = new Logger();

  constructor(
    private coreService: CoreService,
    private templatesService: TemplatesService,
    private userTemplatesService: UserTemplatesService,
    private mediaServerService: MediaServerService,
    private meetingService: MeetingsService,
  ) {}

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
      let userTemplate = await this.userTemplatesService.getUserTemplateById({
        id: body.templateId,
      });

      if (!userTemplate) {
        userTemplate = await this.userTemplatesService.createUserTemplate({
          id: body.templateId,
          userId: req.user.userId,
        });
      }

      const commonTemplate = await this.templatesService.getCommonTemplate({
        templateId: userTemplate.templateId,
      });

      const updatedUserTemplate =
        await this.meetingService.assignMeetingInstance({
          userId: req.user.userId,
          templateId: userTemplate.id,
        });

      await this.coreService.updateRoomRatingStatistic({
        templateId: commonTemplate.id,
        userId: commonTemplate.author,
        ratingKey: 'calls',
        value: 1,
      });

      await this.coreService.updateUserTemplateUsageNumber({
        templateId: updatedUserTemplate.id,
        value: 1,
      });

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

  @Get('templates/:templateId')
  @ApiOperation({ summary: 'Get Meeting Template' })
  @ApiOkResponse({
    type: CommonInstanceMeetingRestDTO,
    description: 'Get Meeting Template Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getMeetingTemplate(@Param('templateId') templateId: string) {
    try {
      const meeting = await this.userTemplatesService.getUserTemplate({
        id: templateId,
      });

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
