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
  ApiTags,
} from '@nestjs/swagger';

// shared
import { ResponseSumType, ICommonUser } from 'shared-types';

// guards
import { JwtAuthGuard } from '../../guards/jwt.guard';

// request
import { UpdateProfileAvatarRequest } from '../../dtos/requests/update-profile-avatar.request';

// services
import { CoreService } from '../../services/core/core.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { ConfigClientService } from '../../services/config/config.service';

@ApiTags('Profile Avatar')
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
  ): Promise<ResponseSumType<ICommonUser>> {
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
  ): Promise<ResponseSumType<ICommonUser>> {
    const user = await this.coreService.deleteProfileAvatar({
      userId: req.user.userId,
    });

    return {
      success: true,
      result: user,
    };
  }
}
