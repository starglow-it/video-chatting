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

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CommonInstanceMeetingRestDTO } from '../dtos/response/common-instance-meeting.dto';

import { MEETINGS_SCOPE } from '@shared/const/api-scopes.const';
import { ResponseSumType } from '@shared/response/common.response';
import { ICommonMeetingInstanceDTO } from '@shared/interfaces/common-instance-meeting.interface';

import { CoreService } from '../core/core.service';
import { CreateMeetingRequest } from '../dtos/requests/create-meeting.request';

@Controller(MEETINGS_SCOPE)
export class MeetingsController {
  private readonly logger = new Logger();
  constructor(private coreService: CoreService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
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
  ): Promise<ResponseSumType<ICommonMeetingInstanceDTO>> {
    try {
      // TODO: logic with create instance and assign server ip and server status to the meeting model
      const meeting = await this.coreService.createMeeting({
        userId: req.user.userId,
        templateId: createMeetingData.templateId,
      });

      return {
        success: true,
        result: meeting,
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
