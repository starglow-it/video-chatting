import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Logger,
  Post,
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
import { UpdateProfileRequest } from '../dtos/requests/update-profile.request';
import { ResponseSumType } from '@shared/response/common.response';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { UpdateProfileAvatarRequest } from '../dtos/requests/update-profile-avatar.request';
import { generateVerificationCode } from '../utils/generateVerificationCode';
import {SAME_PASSWORD, USER_EXISTS} from '@shared/const/errors/users';

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
    const user = await this.coreService.findUserById({
      userId: req.user.userId,
    });

    const frontendUrl = await this.configService.get('frontendUrl');

    const message = `
        ${user.fullName} (${user.email}) has invited you to the meeting
        <a href="${frontendUrl}/meeting/${data.meetingId}">Click to join meeting</a>
    `;

    await this.notificationService.sendEmail({
      to: data.email,
      message,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile' })
  @ApiOkResponse({
    description: 'Profile updated successfully',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async updateProfile(
    @Body() data: UpdateProfileRequest,
    @Request() req,
  ): Promise<ResponseSumType<ICommonUserDTO>> {
    const user = await this.coreService.findUserAndUpdate({
      userId: req.user.userId,
      data,
    });

    return {
      success: true,
      result: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/avatar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile avatar' })
  @ApiOkResponse({
    description: 'Profile avatar updated successfully',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async updateProfileAvatar(
    @Body() data: UpdateProfileAvatarRequest,
    @Request() req,
  ): Promise<ResponseSumType<ICommonUserDTO>> {
    const user = await this.coreService.findUserAndUpdateAvatar({
      userId: req.user.userId,
      data,
    });

    return {
      success: true,
      result: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile/avatar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete profile avatar' })
  @ApiOkResponse({
    description: 'Profile avatar deleted successfully',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async deleteProfileAvatar(
    @Request() req,
  ): Promise<ResponseSumType<ICommonUserDTO>> {
    const user = await this.coreService.deleteProfileAvatar({
      userId: req.user.userId,
    });

    return {
      success: true,
      result: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile email' })
  @ApiOkResponse({
    description: 'Profile email deleted successfully',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async updateProfileEmail(
    @Body() updateEmail: { email: string },
    @Request() req,
  ): Promise<ResponseSumType<ICommonUserDTO>> {
    try {
      const message = `You have changed email\nNew: ${req.user.email}\nOld: ${updateEmail.email}`;

      this.notificationService.sendEmail({
        to: req.user.email,
        message,
      });

      const user = await this.coreService.findUserAndUpdate({
        userId: req.user.userId,
        data: updateEmail,
      });

      return {
        success: true,
        result: user,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while send verification code`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/verify/password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Password' })
  @ApiOkResponse({
    description: 'Password is valid',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async verifyPassword(
    @Body() verifyData: { password: string },
    @Request() req,
  ): Promise<ResponseSumType<any>> {
    try {
      await this.coreService.validateUser({
        userId: req.user.userId,
        password: verifyData.password,
      });

      return {
        success: true,
        result: {},
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while send verification code`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/verify/code')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate verification code' })
  @ApiOkResponse({
    description: 'Code is valid',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async verifyCode(
    @Body() verifyData: { code: string },
    @Request() req,
  ): Promise<ResponseSumType<any>> {
    try {
      await this.coreService.validateUserCode({
        code: verifyData.code,
        userId: req.user.userId,
      });

      return {
        success: true,
        result: {},
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while validate verification code`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/verify/email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate email and send code' })
  @ApiOkResponse({
    description: 'Email is valid',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async verifyEmail(
    @Body() verifyData: { email: string },
    @Request() req,
  ): Promise<ResponseSumType<any>> {
    try {
      const isUserWIthEmailExists = await this.coreService.checkIfUserExists({
        email: verifyData.email,
      });

      if (isUserWIthEmailExists) {
        throw new BadRequestException(USER_EXISTS);
      }

      const code = generateVerificationCode(7);

      await this.coreService.setVerificationCode({
        code,
        userId: req.user.userId,
      });

      const message = `Your verification code: ${code}`;

      this.notificationService.sendEmail({
        to: verifyData.email,
        message,
      });

      return {
        success: true,
        result: {},
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while validate email`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update password' })
  @ApiOkResponse({
    description: 'Password is invalid',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async updatePassword(
    @Body() updateData: { currentPassword: string; newPassword: string },
    @Request() req,
  ) {
    try {
      await this.coreService.validateUser({
        userId: req.user.userId,
        password: updateData.currentPassword,
      });

      const isSamePassword = await this.coreService.comparePasswords({
        userId: req.user.userId,
        password: updateData.newPassword,
      });

      if (isSamePassword) {
        throw new BadRequestException(SAME_PASSWORD);
      }

      await this.coreService.updateUserPassword({
        userId: req.user.userId,
        password: updateData.newPassword,
      });
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while update password`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }
}
