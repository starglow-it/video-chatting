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
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CommonInstanceMeetingRestDTO } from '../dtos/response/common-instance-meeting.dto';

import { MEETINGS_SCOPE } from '@shared/const/api-scopes.const';
import { ResponseSumType } from '@shared/response/common.response';

import { CoreService } from '../core/core.service';
import { CreateMeetingRequest } from '../dtos/requests/create-meeting.request';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';

@Controller(MEETINGS_SCOPE)
export class MeetingsController {
  private readonly logger = new Logger();
  constructor(private coreService: CoreService) {}

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
    @Body() createMeetingData: CreateMeetingRequest,
  ): Promise<ResponseSumType<IUserTemplate>> {
    try {
      // TODO: logic with create instance and assign server ip and server status to the meeting model
      const userTemplate = await this.coreService.createMeeting({
        userId: req.user.userId,
        templateId: createMeetingData.templateId,
      });

      return {
        success: true,
        result: userTemplate,
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

  @UseGuards(JwtAuthGuard)
  @Delete('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Meeting' })
  @ApiOkResponse({
    type: CommonInstanceMeetingRestDTO,
    description: 'Delete Meeting Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async deleteMeeting(
    @Request() req,
    @Body() deleteMeetingData: { templateId: string },
  ): Promise<ResponseSumType<void>> {
    try {
      // TODO: logic with create instance and assign server ip and server status to the meeting model
      await this.coreService.deleteMeeting({
        templateId: deleteMeetingData.templateId,
      });

      return {
        success: true,
        result: undefined,
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
}
