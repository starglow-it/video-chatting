import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

// utils
import { generateVerificationCode } from '../utils/generateVerificationCode';

// shared
import { ResponseSumType } from '@shared/response/common.response';
import { SAME_PASSWORD, USER_EXISTS } from '@shared/const/errors/users';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';

// guards
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

// request
import { UpdateProfileRequest } from '../dtos/requests/update-profile.request';
import { UpdateProfileAvatarRequest } from '../dtos/requests/update-profile-avatar.request';

// services
import { ConfigClientService } from '../config/config.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CoreService } from '../core/core.service';
import { CommonTemplateRestDTO } from '../dtos/response/common-template.dto';
import { EntityList } from '@shared/types/utils/http/list.type';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import { UpdateTemplateRequest } from '../dtos/requests/update-template.request';
import { ICommonTemplate } from '@shared/interfaces/common-template.interface';
import { TemplatesService } from '../templates/templates.service';

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger();

  constructor(
    private configService: ConfigClientService,
    private notificationService: NotificationsService,
    private coreService: CoreService,
    private templatesService: TemplatesService,
  ) {}

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
  @Post('/avatar')
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
  @Delete('/avatar')
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
          message: `An error occurs, while send verification code`,
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

  @UseGuards(JwtAuthGuard)
  @Get('/templates')
  @ApiOperation({ summary: 'Get Profile Templates' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get Profile Templates Success',
  })
  async getUserTemplates(
    @Request() req,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<ResponseSumType<EntityList<IUserTemplate>>> {
    try {
      if (req.user) {
        const template = await this.templatesService.getUserTemplates({
          userId: req.user.userId,
          skip,
          limit,
        });

        return {
          success: true,
          result: template,
        };
      }
      return {
        success: false,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get profile templates`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('templates/:templateId')
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
  @Post('/templates/:templateId')
  @ApiOperation({ summary: 'Update Profile Template' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Update Profile Template Success',
  })
  async updateUserTemplate(
    @Body() updateTemplateData: UpdateTemplateRequest,
    @Param('templateId') templateId: ICommonTemplate['id'],
  ): Promise<ResponseSumType<ICommonTemplate>> {
    try {
      if (templateId) {
        const template = await this.templatesService.updateUserTemplate({
          templateId,
          data: updateTemplateData,
        });

        return {
          success: true,
          result: template,
        };
      }
      return {
        success: false,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while update profile template`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/templates/:templateId')
  @ApiOperation({ summary: 'Delete Profile Template' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Delete Profile Template Success',
  })
  async deleteUserTemplate(
    @Param('templateId') templateId: IUserTemplate['id'],
  ): Promise<ResponseSumType<void>> {
    try {
      if (templateId) {
        await this.templatesService.deleteUserTemplate({
          templateId,
        });

        return {
          success: true,
          result: undefined,
        };
      }
      return {
        success: false,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while delete profile template`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }
}
