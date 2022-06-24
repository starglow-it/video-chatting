import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { CoreService } from '../core/core.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ConfigClientService } from '../config/config.service';
import { InviteAttendeeEmailRequest } from '../dtos/requests/invite-attendee-email.request';
import { TemplatesService } from '../templates/templates.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger();

  constructor(
    private configService: ConfigClientService,
    private notificationService: NotificationsService,
    private coreService: CoreService,
    private templatesService: TemplatesService,
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

      const message = `
        ${user.fullName} (${user.email}) has invited you to the meeting
        <a href="${frontendUrl}/meeting/${data.meetingId}">Click to join meeting</a>
    `;

      await this.notificationService.sendEmail({
        to: data.userEmails,
        message,
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

  @UseGuards(JwtAuthGuard)
  @Get('templates/')
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
}
