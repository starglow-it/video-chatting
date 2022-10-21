import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { CoreService } from '../../services/core/core.service';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ConfigClientService } from '../../services/config/config.service';
import { InviteAttendeeEmailRequest } from '../../dtos/requests/invite-attendee-email.request';
import { SendContactsInfoRequest } from '../../dtos/requests/send-contacts-info.request';
import { emailTemplates } from 'shared';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger();

  constructor(
    private configService: ConfigClientService,
    private notificationService: NotificationsService,
    private coreService: CoreService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('invite/email')
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

      const frontendUrl = await this.configService.get('frontendUrl');

      await this.notificationService.sendEmail({
        to: data.userEmails.map((email) => ({ email, name: email })),
        template: {
          key: emailTemplates.meetingInvite,
          data: [
            {
              name: 'MEETINGURL',
              content: `${frontendUrl}/room/${data.meetingId}`,
            },
            { name: 'SENDER', content: `${user.fullName} (${user.email})` },
          ],
        },
      });
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

  @Post('contacts')
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
}
