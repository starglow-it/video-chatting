import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  Request,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

// shared
import { USER_NOT_CONFIRMED, USER_NOT_FOUND } from 'shared-const';
import {
  TokenPairWithUserType,
  ICommonUser,
  ResponseSumType,
} from 'shared-types';

// dtos
import { CommonResponseDto } from '../../dtos/response/common-response.dto';
import { CommonUserRestDTO } from '../../dtos/response/common-user.dto';

// requests
import { TokenRequest } from '../../dtos/requests/token.request';

// guards
import { LocalAuthGuard } from '../../guards/local.guard';

// services
import { CoreService } from '../../services/core/core.service';
import { AuthService } from './auth.service';

// exception
import { DataValidationException } from '../../exceptions/dataValidation.exception';
import { JwtAdminAuthGuard } from '../../guards/jwt-admin.guard';
import { LoginRequest } from '../../dtos/requests/login.request.dto';

@ApiTags('Auth/Admin')
@Controller('auth/admin')
export class AdminAuthController {
  private readonly logger = new Logger();

  constructor(
    private authService: AuthService,
    private coreService: CoreService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/')
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  @ApiCreatedResponse({
    type: CommonResponseDto,
    description: 'Admin logged in',
  })
  async loginAdmin(
    @Body() body: LoginRequest,
  ): Promise<ResponseSumType<TokenPairWithUserType>> {
    const isUserExists = await this.coreService.checkIfUserExists({
      email: body.email,
    });

    if (!isUserExists) {
      throw new DataValidationException(USER_NOT_FOUND);
    }

    const user = await this.coreService.findUserByEmail({
      email: body.email,
    });

    if (!user.isConfirmed || user.isResetPasswordActive) {
      throw new DataValidationException(USER_NOT_CONFIRMED);
    }

    const result = await this.authService.loginUser(body);

    return {
      success: true,
      result,
    };
  }

  @UseGuards(JwtAdminAuthGuard)
  @Get('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check Admin Auth' })
  @ApiOkResponse({
    type: CommonUserRestDTO,
    description: 'Access allowed',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getAdminProfile(@Request() req): Promise<ResponseSumType<ICommonUser>> {
    try {
      const user = await this.coreService.findUserById({
        userId: req.user.userId,
      });

      return {
        success: true,
        result: user,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get admin profile`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Put('/')
  @ApiOperation({ summary: 'Refresh Admin Token' })
  @ApiOkResponse({
    type: CommonUserRestDTO,
    description: 'Access allowed',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async refreshAdminToken(
    @Body() body: TokenRequest,
  ): Promise<ResponseSumType<TokenPairWithUserType>> {
    try {
      const user = await this.authService.refreshToken({ token: body.token });

      return { success: true, result: user };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while refresh admin token`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Delete('/')
  @ApiOperation({ summary: 'Log Out' })
  @ApiOkResponse({
    type: CommonResponseDto,
    description: 'Logout success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async logoutAdmin(
    @Body() body: TokenRequest,
  ): Promise<ResponseSumType<null>> {
    try {
      await this.authService.logoutUser({ token: body.token });

      return { success: true, result: null };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while admin logout`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }
}
