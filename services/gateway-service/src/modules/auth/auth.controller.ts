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
  OnModuleInit,
  OnApplicationBootstrap,
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
  USER_NOT_GOOGLE_ACCOUNT,
} from 'shared-const';
import {
  TokenPairWithUserType,
  ResponseSumType,
  ICommonUser,
  LoginTypes,
  HttpMethods,
} from 'shared-types';

// dtos
import { CommonResponseDto } from '../../dtos/response/common-response.dto';
import { CommonUserRestDTO } from '../../dtos/response/common-user.dto';

// requests
import { TokenRequest } from '../../dtos/requests/token.request';
import { UserCredentialsRequest } from '../../dtos/requests/userCredentials.request';

// guards
import { LocalAuthGuard } from '../../guards/local.guard';

// services
import { CoreService } from '../../services/core/core.service';
import { AuthService } from './auth.service';
import { DataValidationException } from '../../exceptions/dataValidation.exception';
import { ResetLinkRequest } from '../../dtos/requests/reset-link.request';
import { ResetPasswordRequest } from '../../dtos/requests/reset-password.request';
import { VerifyGoogleAuthRequest } from '../../dtos/requests/verify-google-auth.request';
import { ConfigClientService } from '../../services/config/config.service';
import { google, Auth } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthAnonymousGuard } from '../../guards/jwt-anonymous.guard';
import { CommonCreateFreeUserDto } from '../../dtos/response/common-create-free-user.dto';
import { UsersService } from '../users/users.service';
import { sendHttpRequest } from 'src/utils/http/sendHttpRequest';

@ApiTags('auth')
@Controller(AUTH_SCOPE)
export class AuthController implements OnModuleInit, OnApplicationBootstrap {
  private readonly logger = new Logger();
  private oAuth2Client: Auth.OAuth2Client;
  constructor(
    private authService: AuthService,
    private coreService: CoreService,
    private configService: ConfigClientService,
  ) { }

  private googleClientId: string;
  private googleSecret: string;

  async onModuleInit() {
    this.googleClientId = await this.configService.get<string>(
      'googleClientId',
    );
    this.googleSecret = await this.configService.get<string>('googleSecret');
  }

  async onApplicationBootstrap() {
    this.oAuth2Client = new google.auth.OAuth2(
      this.googleClientId,
      this.googleSecret,
    );
  }

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

  @Post('/create-free-user')
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  @ApiCreatedResponse({
    type: CommonCreateFreeUserDto,
    description: 'User create successful',
  })
  async createAccountWithoutLogin() {
    try {
      const uuid = uuidv4();
      const user = await this.coreService.createUserWithoutLogin(uuid);

      const globalCommonTemplate = await this.coreService.findCommonTemplateByTemplate({
        isAcceptNoLogin: true
      });

      if (!globalCommonTemplate) return;
      const userTemplate = await this.coreService.addTemplateToUser({
        templateId: globalCommonTemplate.id,
        userId: user.id
      });

      return {
        user,
        userTemplateId: userTemplate.id
      }

    }
    catch (err) {
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

    if (user.isBlocked) {
      throw new DataValidationException(USER_IS_BLOCKED);
    }

    if(user.loginType !== LoginTypes.Local){
      throw new DataValidationException(USER_EXISTS);
    }

    const result = await this.authService.loginUser(body);

    return {
      success: true,
      result,
    };
  }



  @UseGuards(JwtAuthAnonymousGuard)
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

  //==================== GOOGLE AUTH =======================

  async getUserDataFromGoogleToken(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oAuth2Client.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oAuth2Client
    });

    return userInfoResponse.data;
  }

  async getImageFromUrl(url: string) {
    try {
      const response = await sendHttpRequest({
        url,
        method: HttpMethods.Get,
        responseType: 'arraybuffer'
      });

      return {
        buffer: response.data,
        mimeType: response.headers['content-type']
      };
    }
    catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('/google-verify')
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  @ApiCreatedResponse({
    type: CommonResponseDto,
    description: 'User logged in',
  })
  async googleAuthRedirect(
    @Body() body: VerifyGoogleAuthRequest,
  ): Promise<ResponseSumType<TokenPairWithUserType>> {
    try {
      const tokenVerified = await this.oAuth2Client.getTokenInfo(body.token);

      const { email } = tokenVerified;

      const isUserExists = await this.coreService.checkIfUserExists({
        email,
      });

      let user: ICommonUser;

      const { given_name, picture } = await this.getUserDataFromGoogleToken(
        body.token,
      );
      
      if (!isUserExists) {
        user = await this.authService.createUserFromGoogleAccount({
          password: 'default',
          email,
          picture,
          name: given_name,
        });
      } else {
        user = await this.coreService.findUserByEmail({
          email,
        });
      }
      
      if(!user.profileAvatar && (user.loginType === LoginTypes.Google)){
        const image = await this.getImageFromUrl(picture);
        await this.coreService.findUserAndUpdateAvatar({
          userId: user.id,
          data: {
            mimeType: image.mimeType,
            size: image.buffer.length,
            profileAvatar: picture
          }
        });
      }

      if (user.isBlocked) {
        throw new DataValidationException(USER_IS_BLOCKED);
      }

      const result = await this.authService.loginUser({ email, password: '' });

      return {
        success: true,
        result,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while verify google token`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }
}
