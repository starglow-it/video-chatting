import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

// dtos
import { CommonTemplateRestDTO } from '../dtos/response/common-template.dto';

// services
import { NotificationsService } from '../notifications/notifications.service';
import { CoreService } from '../core/core.service';
import { ConfigClientService } from '../config/config.service';
import { TemplatesService } from '../templates/templates.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { generateIcsEventData } from '../utils/generateIcsEventData';
import { UploadService } from '../upload/upload.service';
import { v4 as uuidv4 } from 'uuid';

import { receiverScheduleMessage } from '../utils/emailMessages/receiverScheduleMessage';
import { formatDate } from '../utils/dateHelpers/formatDate';
import { parseDateObject } from '../utils/dateHelpers/parseDateObject';

@Controller('users/templates')
export class UserTemplateController {
  private readonly logger = new Logger();

  constructor(
    private configService: ConfigClientService,
    private notificationService: NotificationsService,
    private coreService: CoreService,
    private uploadService: UploadService,
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

  @UseGuards(JwtAuthGuard)
  @Post('/schedule')
  @ApiOperation({ summary: 'Schedule Meeting' })
  @ApiOkResponse({
    description: 'Schedule Meeting',
  })
  async scheduleMeeting(
    @Req() req,
    @Body()
    data: {
      templateId: string;
      startAt: any;
      endAt: any;
      timeZone: string;
      comment: string;
      userEmails: string[];
    },
  ) {
    try {
      const senderUser = await this.coreService.findUserById({
        userId: req.user.userId,
      });

      const template = await this.templatesService.getUserTemplate({
        id: data.templateId,
      });

      const startAt = parseDateObject(data.startAt);
      const endAt = parseDateObject(data.endAt);

      const content = await generateIcsEventData({
        organizerEmail: senderUser.email,
        organizerName: senderUser.fullName,
        startAt: startAt,
        endAt: endAt,
        comment: data.comment,
        attendees: data.userEmails.map(email => ({ name: email, email })),
      });

      const uploadId = uuidv4();

      const key = `uploads/calendarEvents/${template.id}/${uploadId}/invite.ics`;

      const icsLink = await this.uploadService.uploadFile(content, key);

      const icsEventData = {
        method: 'request',
        path: icsLink,
      };

      const startAtDate = formatDate(startAt, data.timeZone);
      const endAtDate = formatDate(endAt, data.timeZone);

      // const senderMessage = senderScheduleMessage({
      //   fullName: targetUser.fullName || targetUser.email,
      //   templateName: template.name,
      //   startAt: startAtDate,
      //   endAt: endAtDate,
      //   comment: data.comment,
      // });

      const receiverMessage = receiverScheduleMessage({
        senderFullName: senderUser.fullName,
        templateName: template.name,
        startAt: startAtDate,
        endAt: endAtDate,
        comment: data.comment,
      });

      await this.notificationService.sendEmail({
        to: data.userEmails,
        message: receiverMessage,
        icalEvent: icsEventData,
      });

      // await this.notificationService.sendEmail({
      //   to: senderUser.email,
      //   message: senderMessage,
      //   icalEvent: icsEventData,
      // });

      return {
        success: true,
        result: {
          icsLink,
        },
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while schedule meeting`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }
}
