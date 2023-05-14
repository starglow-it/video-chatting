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
import {
  USER_TOKEN_NOT_FOUND,
  AUTH_SCOPE,
  USER_EXISTS,
  USER_NOT_CONFIRMED,
  USER_NOT_FOUND,
  USER_IS_BLOCKED,
} from 'shared-const';
import {
  TokenPairWithUserType,
  ResponseSumType,
  ICommonUser,
} from 'shared-types';

// dtos
import { CommonResponseDto } from '../../dtos/response/common-response.dto';
import { CommonUserRestDTO } from '../../dtos/response/common-user.dto';

// requests
import { TokenRequest } from '../../dtos/requests/token.request';
import { UserCredentialsRequest } from '../../dtos/requests/userCredentials.request';

// guards
import { LocalAuthGuard } from '../../guards/local.guard';
import { JwtAuthGuard } from '../../guards/jwt.guard';

// services
import { CoreService } from '../../services/core/core.service';
import { AuthService } from './auth.service';
import { DataValidationException } from '../../exceptions/dataValidation.exception';
import { ResetLinkRequest } from '../../dtos/requests/reset-link.request';
import { ResetPasswordRequest } from '../../dtos/requests/reset-password.request';

@ApiTags('auth')
@Controller(AUTH_SCOPE)
export class AuthController {
  private readonly logger = new Logger();
  constructor(
    private authService: AuthService,
    private coreService: CoreService,
  ) {}

  @Post('/register')
  @ApiCreatedResponse({
    type: CommonResponseDto,
    description: 'User registered success',
  })
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  async register(
    @Body() body: UserCredentialsRequest,
  ): Promise<ResponseSumType<void>> {
    try {
      const isUserExists = await this.coreService.checkIfUserExists({
        email: body.email,
      });

      if (isUserExists) {
        throw new DataValidationException(USER_EXISTS);
      }

      await this.authService.register(body);

      return {
        success: true,
        result: null,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while register`,
          ctx: { email: body.email },
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Post('/confirm-registration')
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  @ApiCreatedResponse({
    type: CommonResponseDto,
    description: 'User confirmed registration success',
  })
  async confirmRegistration(
    @Body() body: TokenRequest,
  ): Promise<ResponseSumType<void>> {
    try {
      const isUserTokenExists = await this.coreService.checkIfUserTokenExists(
        body.token,
      );

      if (!isUserTokenExists) {
        throw new DataValidationException(USER_TOKEN_NOT_FOUND);
      }

      await this.authService.confirmRegister(body);

      return {
        success: true,
        result: null,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while confirm register`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Post('/reset-link')
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  @ApiCreatedResponse({
    type: CommonResponseDto,
    description: 'User start reset password',
  })
  async resetPasswordLink(
    @Body() body: ResetLinkRequest,
  ): Promise<ResponseSumType<void>> {
    try {
      const user = await this.coreService.findUserByEmail({
        email: body.email,
      });

      if (user) {
        await this.authService.sendResetPassword({
          email: body.email,
        });
      }

      return {
        success: true,
        result: null,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while reset link`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @Post('/verify-reset-link')
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  @ApiCreatedResponse({
    type: CommonResponseDto,
    description: 'Verify reset password link',
  })
  async verifyResetPasswordLink(
    @Body() body: TokenRequest,
  ): Promise<ResponseSumType<void>> {
    try {
      const isUserTokenExists = await this.coreService.checkIfUserTokenExists(
        body.token,
      );

      if (!isUserTokenExists) {
        throw new DataValidationException(USER_TOKEN_NOT_FOUND);
      }

      return {
        success: true,
        result: null,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while reset link`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @Post('/reset-password')
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  @ApiCreatedResponse({
    type: CommonResponseDto,
    description: 'Reset password success',
  })
  async resetPassword(
    @Body()
    body: ResetPasswordRequest,
  ): Promise<ResponseSumType<void>> {
    try {
      await this.coreService.resetPassword(body);

      return {
        success: true,
        result: null,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while reset password`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  @ApiCreatedResponse({
    type: CommonResponseDto,
    description: 'User logged in',
  })
  async login(
    @Body() body: UserCredentialsRequest,
  ): Promise<ResponseSumType<TokenPairWithUserType>> {
    console.log('1');
    const isUserExists = await this.coreService.checkIfUserExists({
      email: body.email,
    });
    console.log('2');


    if (!isUserExists) {
      throw new DataValidationException(USER_NOT_FOUND);
    }
    console.log('3');

    const user = await this.coreService.findUserByEmail({
      email: body.email,
    });
    console.log('4');

    if (!user.isConfirmed || user.isResetPasswordActive) {
      throw new DataValidationException(USER_NOT_CONFIRMED);
    }
    console.log('5');

    if (user.isBlocked) {
      throw new DataValidationException(USER_IS_BLOCKED);
    }
    console.log('6');

    const result = await this.authService.loginUser(body);
    console.log('7');

    return {
      success: true,
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check Auth' })
  @ApiOkResponse({
    type: CommonUserRestDTO,
    description: 'Access allowed',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getProfile(@Request() req): Promise<ResponseSumType<ICommonUser>> {
    try {
      const user = await this.coreService.findUserById({
        userId: req.user.userId,
      });

      return { success: true, result: user };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get profile`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Put('/refresh')
  @ApiOperation({ summary: 'Check Auth' })
  @ApiOkResponse({
    type: CommonUserRestDTO,
    description: 'Access allowed',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async refreshToken(
    @Body() body: TokenRequest,
  ): Promise<ResponseSumType<TokenPairWithUserType>> {
    try {
      const user = await this.authService.refreshToken({ token: body.token });

      return { success: true, result: user };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while refresh profile`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Delete('/logout')
  @ApiOperation({ summary: 'Log Out' })
  @ApiOkResponse({
    type: CommonResponseDto,
    description: 'Logout success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async logoutUser(@Body() body: TokenRequest): Promise<ResponseSumType<null>> {
    try {
      await this.authService.logoutUser({ token: body.token });

      return { success: true, result: null };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while logout`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }
}
