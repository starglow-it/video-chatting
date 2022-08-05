import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

import {
  CONFIRM_REGISTRATION_PATTERN,
  LOGIN_USER,
  LOGOUT_USER,
  REFRESH_TOKEN,
  REGISTER_USER_PATTERN,
  SEND_RESET_PASSWORD_LINK,
} from '@shared/patterns/auth';
import { IUserCredentials } from '@shared/types/registerUser.type';
import { ConfirmUser } from '@shared/types/confirmUser.type';
import { TokenPairWithUserType } from '@shared/types/token-pair-with-user.type';

// services
import { NotificationsService } from '../notifications/notifications.service';
import { CoreService } from '../core/core.service';
import { ConfirmTokenService } from '../confirm-token/confirm-token.service';
import { ConfigClientService } from '../config/config.service';
import { AuthService } from './auth.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';

// helpers
import { IToken } from '@shared/interfaces/token.interface';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { ResetPasswordTokenService } from '../reset-password-token/reset-password-token.service';
import { emailTemplates } from '@shared/const/email-templates.const';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private coreService: CoreService,
    private notificationService: NotificationsService,
    private confirmTokenService: ConfirmTokenService,
    private refreshTokenService: RefreshTokenService,
    private resetPasswordToken: ResetPasswordTokenService,
    private configService: ConfigClientService,
  ) {}

  @MessagePattern({ cmd: REGISTER_USER_PATTERN })
  async register(
    @Payload() registerRequest: IUserCredentials,
  ): Promise<ICommonUserDTO> {
    try {
      const frontendUrl = await this.configService.get('frontendUrl');

      const token = await this.confirmTokenService.generateToken({
        email: registerRequest.email,
      });

      const user = await this.coreService.createUser({
        user: registerRequest,
        token,
      });

      this.notificationService.sendConfirmRegistrationEmail({
        template: {
          key: emailTemplates.emailVerification,
          data: [
            {
              name: 'CONFIRMLINK',
              content: `${frontendUrl}/confirm-registration?token=${token.token}`,
            },
          ],
        },
        to: [{ email: registerRequest.email, name: registerRequest.email }],
      });

      return user;
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern({ cmd: CONFIRM_REGISTRATION_PATTERN })
  async confirmRegistration(
    @Payload() confirmUser: ConfirmUser,
  ): Promise<ICommonUserDTO> {
    try {
      const confirmTokenPayload = await this.confirmTokenService.validateToken({
        token: confirmUser.token,
      });

      await this.coreService.deleteToken(confirmUser);

      await this.notificationService.sendConfirmRegistrationEmail({
        template: {
          key: emailTemplates.welcomeEmail,
          data: [
            {
              name: 'FNAME',
              content: confirmTokenPayload?.email,
            },
          ],
        },
        to: [
          {
            email: confirmTokenPayload?.email,
            name: confirmTokenPayload.email,
          },
        ],
      });

      return this.coreService.findUserByEmailAndUpdate({
        email: confirmTokenPayload?.email,
        data: { isConfirmed: true },
      });
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern({ cmd: LOGIN_USER })
  async loginUser(
    @Payload() loginData: IUserCredentials,
  ): Promise<TokenPairWithUserType> {
    try {
      const user = await this.coreService.loginUserByEmail(loginData);

      const { accessToken, refreshToken } =
        await this.authService.generateAuthenticationTokens({ user });

      await this.coreService.assignTokensToUser({
        user,
        accessToken,
        refreshToken,
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern({ cmd: REFRESH_TOKEN })
  async refreshToken(@Payload() token: IToken): Promise<TokenPairWithUserType> {
    try {
      const tokenData = this.refreshTokenService.decodeToken(token);

      const user = await this.coreService.findUserById({
        userId: tokenData.userId,
      });

      const { accessToken, refreshToken } =
        await this.authService.generateAuthenticationTokens({ user });

      await this.coreService.assignTokensToUser({
        user,
        accessToken,
        refreshToken,
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern({ cmd: LOGOUT_USER })
  async logoutUser(@Payload() token: IToken): Promise<void> {
    try {
      await this.coreService.deleteToken(token);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern({ cmd: SEND_RESET_PASSWORD_LINK })
  async sendResetPasswordLink(
    @Payload() data: { email: string },
  ): Promise<void> {
    try {
      const frontendUrl = await this.configService.get('frontendUrl');

      const user = await this.coreService.findUserByEmail({
        email: data.email,
      });

      const token = await this.resetPasswordToken.generateToken({
        user,
      });

      await this.coreService.setResetPasswordToken({
        email: data.email,
        token,
      });

      this.notificationService.sendConfirmRegistrationEmail({
        template: {
          key: emailTemplates.resetPassword,
          data: [
            {
              name: 'RESETURL',
              content: `${frontendUrl}/reset-password?token=${token.token}`,
            },
          ],
        },
        to: [{ email: data.email, name: user.fullName }],
      });
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
