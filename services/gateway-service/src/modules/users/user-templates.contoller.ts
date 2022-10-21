import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

// dtos
import { CommonTemplateRestDTO } from '../../dtos/response/common-template.dto';

// services
import { NotificationsService } from '../../services/notifications/notifications.service';
import { CoreService } from '../../services/core/core.service';
import { ConfigClientService } from '../../services/config/config.service';
import { TemplatesService } from '../templates/templates.service';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { generateIcsEventData } from '../../utils/generateIcsEventData';
import { UploadService } from '../upload/upload.service';
import { v4 as uuidv4 } from 'uuid';

import { formatDate } from '../../utils/dateHelpers/formatDate';
import { parseDateObject } from '../../utils/dateHelpers/parseDateObject';
import { getTzOffset } from '../../utils/dateHelpers/getTzOffset';
import { emailTemplates } from 'shared';
import { FileInterceptor } from '@nestjs/platform-express';
import { IUpdateTemplate } from 'shared';
import { getFileNameAndExtension } from '../../utils/getFileNameAndExtension';

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

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Users Templates' })
  @ApiOkResponse({
    description: 'Fetch users templates succeeded',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getUsersTemplates(
    @Req() req,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    try {
      const templatesData = await this.templatesService.getUsersTemplates({
        userId: req.user.userId,
        skip,
        limit,
      });

      return {
        success: true,
        result: templatesData,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get common templates`,
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
  @Put('/:templateId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Template' })
  @ApiOkResponse({
    description: 'Update Template',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      preservePath: true,
    }),
  )
  async updateUserTemplate(
    @Request() req,
    @Param('templateId') templateId: string,
    @Body() templateData: Partial<IUpdateTemplate>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!templateId) {
        return {
          success: false,
        };
      }

      let userTemplate = await this.templatesService.getUserTemplateById({
        id: templateId,
      });

      if (file) {
        const { extension } = getFileNameAndExtension(file.originalname);

        const uploadKey = `templates/videos/${templateId}/${uuidv4()}.${extension}`;

        await this.uploadService.deleteFolder(`templates/videos/${templateId}`);

        let url = await this.uploadService.uploadFile(file.buffer, uploadKey);

        if (!/^https:\/\/*/.test(url)) {
          url = `https://${url}`;
        }

        userTemplate = await this.coreService.uploadUserTemplateFile({
          url,
          id: templateId,
          mimeType: file.mimetype,
        });
      }

      if (Object.keys(templateData).length > 1) {
        userTemplate = await this.templatesService.updateUserTemplate({
          templateId,
          userId: req.user.userId,
          data: templateData,
        });
      }

      return {
        success: true,
        result: userTemplate,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while update template`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add/:templateId')
  @ApiOperation({ summary: 'Add Template to user' })
  @ApiOkResponse({
    description: 'Add template to user',
  })
  async addTemplateToUser(@Req() req, @Param('templateId') templateId: string) {
    try {
      if (templateId) {
        const template = await this.templatesService.getCommonTemplateById({
          id: templateId,
        });

        if (template) {
          let userTemplate =
            await this.templatesService.getUserTemplateByTemplateId({
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
