import {
  Body,
  Controller,
  Delete,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

// shared
import { ResponseSumType } from '@shared/response/common.response';

// interfaces
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';

// guards
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

// request
import { UpdateProfileAvatarRequest } from '../dtos/requests/update-profile-avatar.request';

// services
import { CoreService } from '../core/core.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ConfigClientService } from '../config/config.service';

@Controller('profile/avatar')
export class ProfileAvatarController {
  constructor(
    private configService: ConfigClientService,
    private notificationService: NotificationsService,
    private coreService: CoreService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
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
  @Delete('/')
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
}
