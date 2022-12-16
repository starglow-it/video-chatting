import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

// shared
import { emailTemplates } from 'shared-const';
import {
  EntityList,
  ICommonUser,
  KickUserReasons,
  ResponseSumType,
  UserRoles,
} from 'shared-types';

// services
import { NotificationsService } from '../../services/notifications/notifications.service';
import { CoreService } from '../../services/core/core.service';
import { ConfigClientService } from '../../services/config/config.service';
import { UploadService } from '../upload/upload.service';
import { TemplatesService } from '../templates/templates.service';
import { PaymentsService } from '../payments/payments.service';
import { SocketService } from '../../services/socket/socket.service';
import { UserTemplatesService } from '../user-templates/user-templates.service';

// dtos
import { CommonTemplateRestDTO } from '../../dtos/response/common-template.dto';
import { CommonUserRestDTO } from '../../dtos/response/common-user.dto';

// guards
import { JwtAuthGuard } from '../../guards/jwt.guard';

// request
import { InviteAttendeeEmailRequest } from '../../dtos/requests/invite-attendee-email.request';
import { SendContactsInfoRequest } from '../../dtos/requests/send-contacts-info.request';

// utils
import { parseDateObject } from '../../utils/dateHelpers/parseDateObject';
import { getTzOffset } from '../../utils/dateHelpers/getTzOffset';
import { generateIcsEventData } from '../../utils/generateIcsEventData';
import { formatDate } from '../../utils/dateHelpers/formatDate';

@Controller('/users')
export class UsersController {
  private readonly logger = new Logger();

  frontendUrl: string;

  constructor(
    private configService: ConfigClientService,
    private notificationService: NotificationsService,
    private coreService: CoreService,
    private uploadService: UploadService,
    private templatesService: TemplatesService,
    private userTemplatesService: UserTemplatesService,
    private paymentsService: PaymentsService,
    private socketService: SocketService,
  ) {}

  async onModuleInit() {
    this.frontendUrl = await this.configService.get<string>('frontendUrl');
  }

  @Get('/')
  @ApiOperation({ summary: 'List Users' })
  @ApiOkResponse({
    description: 'Get List Users success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async listUsers(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('search') search: string,
    @Query('sort') sort: string,
  ): Promise<ResponseSumType<EntityList<ICommonUser>>> {
    try {
      const query = { isConfirmed: true, role: UserRoles.User };

      const users = await this.coreService.findUsers({
        query,
        options: {
          skip,
          limit,
          search,
          sort: 'fullName',
          direction: 1,
        },
      });

      const usersCount = await this.coreService.countUsers(query);

      return {
        success: true,
        result: {
          count: usersCount,
          list: users,
        },
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while list users`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Get('/search')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search Users' })
  @ApiOkResponse({
    description: 'Get Search Users success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async searchUsers(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('search') search: string,
    @Query('sort') sort: string,
  ): Promise<ResponseSumType<EntityList<ICommonUser>>> {
    try {
      const query = { isConfirmed: true, role: UserRoles.User };

      const { list, count } = await this.coreService.searchUsers({
        query,
        options: {
          skip,
          limit,
          search,
          sort: 'fullName',
          direction: 1,
        },
      });

      return {
        success: true,
        result: {
          count,
          list,
        },
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get search users`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Get('/:userId/templates')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Users Templates' })
  @ApiOkResponse({
    description: 'Fetch users templates succeeded',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getUsersTemplates(
    @Param('userId') userId: string,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort') sort: string,
    @Query('dir', ParseIntPipe) direction: number,
  ) {
    try {
      const templatesData = await this.userTemplatesService.getUserTemplates({
        userId,
        skip,
        limit,
        sort,
        direction,
      });

      return {
        success: true,
        result: templatesData,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get user templates`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Get('/templates/:templateId')
  @ApiOperation({
    summary: 'Get Template',
  })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get User Template Success',
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
          message: `An error occurs, while get user template`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @Get('/:userId')
  @ApiOperation({ summary: 'Get User by id' })
  @ApiOkResponse({
    type: CommonUserRestDTO,
    description: 'Get User By Id success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getUserById(
    @Param('userId') userId: string,
  ): Promise<ResponseSumType<ICommonUser>> {
    try {
      const user = await this.coreService.findUserById({
        userId,
      });

      return {
        success: true,
        result: user,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get user by id`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Delete('/:userId')
  @ApiOperation({ summary: 'Delete User by id' })
  @ApiOkResponse({
    description: 'Delete User By Id success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async deleteUserById(
    @Param('userId') userId: string,
  ): Promise<ResponseSumType<void>> {
    try {
      const user = await this.coreService.findUserById({ userId });

      await this.coreService.deleteUser({
        userId,
      });

      await this.coreService.updateCountryStatistics({
        key: user.country,
        value: -1,
      });

      if (user.stripeSubscriptionId) {
        await this.paymentsService.cancelUserSubscription({
          subscriptionId: user.stripeSubscriptionId,
        });
      }

      this.notificationService.sendEmail({
        to: [{ email: user.email, name: user.fullName ?? user.email }],
        template: {
          key: emailTemplates.deletedAccountByAdmin,
          data: [
            { name: 'USERNAME', content: `${user.fullName ?? user.email}` },
            { name: 'SUPPORT_URL', content: `${this.frontendUrl}/support` },
          ],
        },
      });

      this.socketService.kickUserFromMeeting({
        userId,
        reason: KickUserReasons.Deleted,
      });

      return {
        success: true,
        result: undefined,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get user by id`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Post('/rights/:userId')
  @ApiOperation({ summary: 'Manage User Right by id' })
  @ApiOkResponse({
    type: CommonUserRestDTO,
    description: 'Manage User Rights By Id success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async blockUserById(
    @Param('userId') userId: string,
    @Query('key') key: string,
    @Query('value', ParseBoolPipe) value: boolean,
  ): Promise<ResponseSumType<ICommonUser>> {
    try {
      const user = await this.coreService.manageUserRights({
        userId,
        key,
        value,
      });

      if (user.stripeSubscriptionId) {
        if (user.isBlocked) {
          await this.paymentsService.cancelUserSubscription({
            subscriptionId: user.stripeSubscriptionId,
          });

          this.notificationService.sendEmail({
            to: [{ email: user.email, name: user.fullName ?? user.email }],
            template: {
              key: emailTemplates.blockedAccount,
              data: [
                { name: 'USERNAME', content: `${user.fullName ?? user.email}` },
                { name: 'SUPPORT_URL', content: `${this.frontendUrl}/support` },
              ],
            },
          });
        }
      }

      this.socketService.kickUserFromMeeting({
        userId,
        reason: KickUserReasons.Blocked,
      });

      return {
        success: true,
        result: user,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get user by id`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/invite/email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite Attendee By Email' })
  @ApiOkResponse({
    description: 'Invite Email sent',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async inviteAttendeeByEmail(
    @Body() data: InviteAttendeeEmailRequest,
    @Request() req,
  ): Promise<void> {
    try {
      const user = await this.coreService.findUserById({
        userId: req.user.userId,
      });

      this.notificationService.sendEmail({
        to: data.userEmails.map((email) => ({ email, name: email })),
        template: {
          key: emailTemplates.meetingInvite,
          data: [
            {
              name: 'MEETINGURL',
              content: `${this.frontendUrl}/room/${data.meetingId}`,
            },
            { name: 'SENDER', content: `${user.fullName} (${user.email})` },
          ],
        },
      });
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while invite attendee by email`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Post('/contacts')
  @ApiOperation({ summary: 'Send contacts info' })
  @ApiOkResponse({
    description: 'Contacts info sent',
  })
  async sendContactsInfo(@Body() data: SendContactsInfoRequest): Promise<void> {
    try {
      const supportEmail = await this.configService.get('supportEmail');
      await this.notificationService.sendEmail({
        to: [{ email: supportEmail, name: 'support' }],
        template: {
          key: emailTemplates.contactUs,
          data: [
            { name: 'NAME', content: data.name },
            { name: 'EMAIL', content: data.email },
            { name: 'MESSAGE', content: data.message },
          ],
        },
      });
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while send contacts info`,
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

      const template = await this.userTemplatesService.getUserTemplateById({
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

      const icsLink = await this.uploadService.uploadFile(
        Buffer.from(content),
        key,
      );

      const startAtDate = formatDate(startAt, data.timeZone);

      this.notificationService.sendEmail({
        template: {
          key: emailTemplates.meetingInviteIcs,
          data: [
            {
              name: 'MEETINGURL',
              content: `${this.frontendUrl}/room/${
                template.customLink || template.id
              }`,
            },
            { name: 'DATE', content: startAtDate },
            {
              name: 'SENDER',
              content: senderUser.fullName
                ? `${senderUser.fullName} (${senderUser.email})`
                : senderUser.email,
            },
          ],
        },
        to: data.userEmails.map((email) => ({ email, name: email })),
        icsEventLink: icsLink,
        icalEventContent: content,
      });
      this.notificationService.sendEmail({
        template: {
          key: emailTemplates.scheduledMeeting,
          data: [
            {
              name: 'MEETINGURL',
              content: `${this.frontendUrl}/room/${
                template.customLink || template.id
              }`,
            },
            { name: 'DATE', content: startAtDate },
            { name: 'ROOMNAME', content: template.name },
          ],
        },
        to: [{ email: senderUser.email, name: senderUser.email }],
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
