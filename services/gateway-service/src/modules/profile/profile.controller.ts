import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
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

// utils
import { generateVerificationCode } from '../../utils/generateVerificationCode';

// shared
import { emailTemplates, SAME_PASSWORD, USER_EXISTS } from 'shared-const';
import { ResponseSumType, ICommonUser, PlanKeys } from 'shared-types';

// guards
import { JwtAuthGuard } from '../../guards/jwt.guard';

// request
import { UpdateProfileRequest } from '../../dtos/requests/update-profile.request';

// services
import { CoreService } from '../../services/core/core.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { ConfigClientService } from '../../services/config/config.service';
import { PaymentsService } from '../payments/payments.service';

@ApiTags('Profiles')
@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger();

  constructor(
    private configService: ConfigClientService,
    private notificationService: NotificationsService,
    private coreService: CoreService,
    private paymentsService: PaymentsService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get profile' })
  @ApiOkResponse({
    description: 'Profile retrieved successfully',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getProfile(@Request() req): Promise<ResponseSumType<ICommonUser>> {
    const user = await this.coreService.findUserById({
      userId: req.user.userId,
    });

    return {
      success: true,
      result: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
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
  ): Promise<ResponseSumType<ICommonUser>> {
    const user = await this.coreService.findUserAndUpdate({
      userId: req.user.userId,
      data,
    });

    if (data.hasOwnProperty("companyName") && Array.isArray(user.teamMembers) && user.teamMembers?.length > 0) {
      for (const teamMember of user.teamMembers) {
        const teamMemberUser = await this.coreService.findUserByEmail({
          email: teamMember.email,
        });

        if (teamMemberUser && Boolean(teamMemberUser.teamOrganization)) {
          await this.coreService.findUserAndUpdate({
            userId: teamMemberUser.id,
            data: { teamOrganization: { name: data.companyName, seat: teamMemberUser.teamOrganization?.seat } }
          });
        }
      }
    }

    return {
      success: true,
      result: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/delete-seat-team-member')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Seat Team Member' })
  @ApiOkResponse({
    description: 'Seat team member is deleted successfully',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async DeleteSeatTeamMember(
    @Body() data: { email: string },
    @Request() req,
  ): Promise<ResponseSumType<ICommonUser> | null> {
    const user = await this.coreService.findUserByEmail({ email: data.email });
    if (user) {
      const updatedUser = await this.coreService.findUserAndUpdate({
        userId: user.id, data: {
          teamMembers: [],
          teamOrganization: null,
          subscriptionPlanKey: PlanKeys.House
        }
      });

      return {
        success: true,
        result: updatedUser,
      };
    }

    return {
      success: true,
      result: null,
    };

  }

  @UseGuards(JwtAuthGuard)
  @Post('/remove-seat-team-member-from-host')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove Team Member From Host' })
  @ApiOkResponse({
    description: 'Seat team member is removed successfully',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async RemoveTeamMemberFromHost(
    @Body() data: { orgEmails: string[], memberEmail: string },
    @Request() req,
  ): Promise<ResponseSumType<ICommonUser> | null> {
    if (data.orgEmails.length > 0) {
      for (const orgEmail of data.orgEmails) {
        const user = await this.coreService.findUserByEmail({ email: orgEmail });
        if (user) {
          let newTeamMembers = user.teamMembers.filter(tm => tm.email !== data.memberEmail);
          await this.coreService.findUserAndUpdate({
            userId: user.id,
            data: {
              teamMembers: newTeamMembers
            }
          });
        }
      }
    }

    return {
      success: true,
      result: null,
    };

  }

  @UseGuards(JwtAuthGuard)
  @Delete('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete profile' })
  @ApiOkResponse({
    description: 'Profile deleted successfully',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async deleteProfile(@Request() req): Promise<ResponseSumType<void>> {
    const targetUser = await this.coreService.findUserById({
      userId: req.user.userId,
    });

    await this.coreService.deleteUser({
      userId: req.user.userId,
    });

    if (targetUser.stripeSubscriptionId) {
      await this.paymentsService.cancelUserSubscription({
        subscriptionId: targetUser.stripeSubscriptionId,
      });
    }

    this.notificationService.sendEmail({
      template: {
        key: emailTemplates.deletedAccount,
      },
      to: [
        {
          email: targetUser.email,
          name: targetUser.fullName,
        },
      ],
    });

    return {
      success: true,
      result: undefined,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/email')
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
  ): Promise<ResponseSumType<ICommonUser>> {
    try {
      const frontendUrl = await this.configService.get('frontendUrl');

      const user = await this.coreService.findUserByEmail({
        email: req.user.email,
      });

      this.notificationService.sendEmail({
        to: [{ email: updateEmail.email, name: user.fullName }],
        template: {
          key: emailTemplates.emailUpdated,
          data: [{ name: 'BACKURL', content: `${frontendUrl}/dashboard` }],
        },
      });

      this.notificationService.sendEmail({
        to: [{ email: req.user.email, name: user.fullName }],
        template: {
          key: emailTemplates.emailOldUpdated,
          data: [
            { name: 'BACKURL', content: `${frontendUrl}/dashboard` },
            { name: 'NEWEMAIL', content: `${updateEmail.email}` },
          ],
        },
      });

      const updatedUser = await this.coreService.findUserAndUpdate({
        userId: req.user.userId,
        data: updateEmail,
      });

      return {
        success: true,
        result: updatedUser,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while update profile email`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/verify/password')
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
          message: `An error occurs, while verify password`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/verify/code')
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
  @Post('/verify/email')
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
      const isUserWithEmailExists = await this.coreService.checkIfUserExists({
        email: verifyData.email,
      });

      if (isUserWithEmailExists) {
        throw new BadRequestException(USER_EXISTS);
      }

      const user = await this.coreService.findUserById({
        userId: req.user.userId,
      });

      const code = generateVerificationCode(7);

      await this.coreService.setVerificationCode({
        code,
        userId: req.user.userId,
      });

      this.notificationService.sendEmail({
        to: [{ email: verifyData.email, name: user.fullName }],
        template: {
          key: emailTemplates.codeVerification,
          data: [
            { name: 'CODE', content: code },
            { name: 'USERNAME', content: user.fullName },
          ],
        },
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
  @Post('/password')
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
