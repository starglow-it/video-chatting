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
  ApiTags,
} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

// shared
import { emailTemplates } from 'shared-const';
import {
  EntityList,
  ICommonUser,
  KickUserReasons,
  MeetingRole,
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
import { MeetingsService } from '../meetings/meetings.service';
import { JwtAuthAnonymousGuard } from '../../guards/jwt-anonymous.guard';
import { ScheduleRequestDto } from '../../dtos/requests/schedule.dto';

@ApiTags('Users')
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
    private meetingService: MeetingsService,
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

  @Get('/templates/id/:templateId')
  @ApiOperation({
    summary: 'Get Template by id',
  })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get User Template by id Success',
  })
  async getUserTemplateById(@Param('templateId') templateId: string) {
    try {
      if (templateId) {
        const template = await this.userTemplatesService.getUserTemplateById({
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
          message: `An error occurs, while get user template by template id`,
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
        }
      }

      if (user.isBlocked) {
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

        this.socketService.kickUserFromMeeting({
          userId,
          reason: KickUserReasons.Blocked,
        });
      } else {
        this.notificationService.sendEmail({
          to: [{ email: user.email, name: user.fullName ?? user.email }],
          template: {
            key: emailTemplates.unblockedAccount,
            data: [{ name: 'LOGIN_URL', content: `${this.frontendUrl}/login` }],
          },
        });
      }

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

  @UseGuards(JwtAuthAnonymousGuard)
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
    @Body() body: InviteAttendeeEmailRequest,
    @Request() req,
  ): Promise<void> {
    try {
      const user = await this.coreService.findUserById({
        userId: req.user.userId,
      });
      let senderEmail = user.email;
      let senderName = user.fullName;

      if (user.role === UserRoles.Anonymous) {
        senderEmail = 'anonymous@gmail.com';
        senderName = 'Anonymous';
      }

      const acceptRoles = [MeetingRole.Lurker];

      this.notificationService.sendEmail({
        to: body.userEmails.map((email) => ({ email, name: email })),
        template: {
          key: emailTemplates.meetingInvite,
          data: [
            {
              name: 'MEETINGURL',
              content: `${this.frontendUrl}/room/${body.meetingId}${
                acceptRoles.includes(body.role) ? `?role=${body.role}` : ''
              }`,
            },
            { name: 'SENDER', content: `${senderName} (${senderEmail})` },
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
  async scheduleMeeting(@Req() req, @Body() body: ScheduleRequestDto) {
    try {
      const senderUser = await this.coreService.findUserById({
        userId: req.user.userId,
      });

      const template = await this.userTemplatesService.getUserTemplateById({
        id: body.templateId,
      });

      const startAt = parseDateObject(body.startAt);
      const endAt = parseDateObject(body.endAt);

      const tzOffset = getTzOffset(startAt, body.timeZone);
      const meetingUrl = `${this.frontendUrl}/room/${
        template.customLink || template.id
      }?role=${body.role ?? ''}`;

      const content = await generateIcsEventData({
        organizerEmail: senderUser.email,
        organizerName: senderUser.fullName,
        startAt: startAt - tzOffset,
        endAt: endAt - tzOffset,
        comment: body.comment,
        url: meetingUrl,
        attendees: body.userEmails.map((email) => ({ name: email, email })),
      });

      const uploadId = uuidv4();

      const key = `uploads/calendarEvents/${template.id}/${uploadId}/invite.ics`;

      const icsLink = await this.uploadService.uploadFile(
        Buffer.from(content),
        key,
      );

      const startAtDate = formatDate(startAt, body.timeZone);

      this.notificationService.sendEmail({
        template: {
          key: emailTemplates.meetingInviteIcs,
          data: [
            {
              name: 'MEETINGURL',
              content: meetingUrl,
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
        to: body.userEmails.map((email) => ({ email, name: email })),
        icsEventLink: icsLink,
        icalEventContent: content,
      });

      this.notificationService.sendEmail({
        template: {
          key: emailTemplates.scheduledMeeting,
          data: [
            {
              name: 'MEETINGURL',
              content: meetingUrl,
            },
            { name: 'DATE', content: startAtDate },
            { name: 'ROOMNAME', content: template.name },
          ],
        },
        to: [{ email: senderUser.email, name: senderUser.email }],
        icsEventLink: icsLink,
        icalEventContent: content,
      });

      await this.meetingService.assignMeetingInstance({
        userId: req.user.userId,
        templateId: template.id,
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
