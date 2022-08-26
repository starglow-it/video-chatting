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

import { formatDate } from '../utils/dateHelpers/formatDate';
import { parseDateObject } from '../utils/dateHelpers/parseDateObject';
import { getTzOffset } from '../utils/dateHelpers/getTzOffset';
import { emailTemplates } from '@shared/const/email-templates.const';

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
    description: 'Get User Template Success',
  })
  async getUserTemplateById(@Param('templateId') templateId: string) {
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
      const frontendUrl = await this.configService.get('frontendUrl');

      const senderUser = await this.coreService.findUserById({
        userId: req.user.userId,
      });

      const template = await this.templatesService.getUserTemplate({
        id: data.templateId,
      });

      const startAt = parseDateObject(data.startAt);
      const endAt = parseDateObject(data.endAt);

      const tzOffset = getTzOffset(startAt, data.timeZone);

      const content = await generateIcsEventData({
        organizerEmail: senderUser.email,
        organizerName: senderUser.fullName,
        startAt: startAt - tzOffset,
        endAt: endAt - tzOffset,
        comment: data.comment,
        attendees: data.userEmails.map((email) => ({ name: email, email })),
      });

      const uploadId = uuidv4();

      const key = `uploads/calendarEvents/${template.id}/${uploadId}/invite.ics`;

      const icsLink = await this.uploadService.uploadFile(content, key);

      const startAtDate = formatDate(startAt, data.timeZone);

      await this.notificationService.sendEmail({
        template: {
          key: emailTemplates.meetingInviteIcs,
          data: [
            {
              name: 'MEETINGURL',
              content: `${frontendUrl}/room/${
                template.customLink || template.id
              }`,
            },
            { name: 'DATE', content: startAtDate },
            {
              name: 'SENDER',
              content: `${senderUser.fullName} (${senderUser.email})`,
            },
          ],
        },
        to: data.userEmails.map((email) => ({ email, name: email })),
        icsEventLink: icsLink,
        icalEventContent: content,
      });

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
