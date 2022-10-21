import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

import {
  AuthBrokerPatterns,
  TokenPairWithUserType,
  ICommonUserDTO,
  TokenTypes,
  ConfirmUserRegistrationPayload,
  RegisterUserPayload,
  LoginUserByEmailPayload,
  RefreshTokenPayload,
  LogOutUserPayload,
  SendResetPasswordLinkEmailPayload,
} from 'shared';

// services
import { NotificationsService } from '../../services/notifications/notifications.service';
import { CoreService } from '../../services/core/core.service';
import { ConfigClientService } from '../../services/config/config.service';
import { AuthService } from './auth.service';

// helpers
import { emailTemplates } from 'shared';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private coreService: CoreService,
    private notificationService: NotificationsService,
    private configService: ConfigClientService,
  ) {}

  @MessagePattern({ cmd: AuthBrokerPatterns.RegisterUserPattern })
  async register(
    @Payload() payload: RegisterUserPayload,
  ): Promise<ICommonUserDTO> {
    try {
      const frontendUrl = await this.configService.get('frontendUrl');

      const token = await this.authService.generateToken({
        email: payload.email,
        type: TokenTypes.Confirm,
      });

      const user = await this.coreService.createUser({
        user: payload,
        token,
      });

      this.notificationService.sendEmail({
        template: {
          key: emailTemplates.emailVerification,
          data: [
            {
              name: 'CONFIRMLINK',
              content: `${frontendUrl}/confirm-registration?token=${token.token}`,
            },
          ],
        },
        to: [{ email: payload.email, name: payload.email }],
      });

      return user;
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern({ cmd: AuthBrokerPatterns.ConfirmRegistration })
  async confirmRegistration(
    @Payload() payload: ConfirmUserRegistrationPayload,
  ): Promise<ICommonUserDTO> {
    try {
      const confirmToken = await this.authService.validateToken({
        token: payload.token,
        type: TokenTypes.Confirm,
      });

      await this.coreService.deleteToken(payload);

      await this.notificationService.sendEmail({
        template: {
          key: emailTemplates.welcomeEmail,
          data: [
            {
              name: 'FNAME',
              content: confirmToken?.email,
            },
          ],
        },
        to: [
          {
            email: confirmToken?.email,
            name: confirmToken.email,
          },
        ],
      });

      return this.coreService.findUserByEmailAndUpdate({
        email: confirmToken?.email,
        data: { isConfirmed: true },
      });
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern({ cmd: AuthBrokerPatterns.LoginUser })
  async loginUser(
    @Payload() payload: LoginUserByEmailPayload,
  ): Promise<TokenPairWithUserType> {
    try {
      const user = await this.coreService.loginUserByEmail(payload);

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

  @MessagePattern({ cmd: AuthBrokerPatterns.RefreshToken })
  async refreshToken(
    @Payload() payload: RefreshTokenPayload,
  ): Promise<TokenPairWithUserType> {
    try {
      const tokenData = this.authService.decodeToken({
        token: payload,
        type: TokenTypes.Refresh,
      });

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

  @MessagePattern({ cmd: AuthBrokerPatterns.LogOutUser })
  async logoutUser(@Payload() payload: LogOutUserPayload): Promise<void> {
    try {
      await this.coreService.deleteToken(payload);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern({ cmd: AuthBrokerPatterns.SendResetPasswordLink })
  async sendResetPasswordLink(
    @Payload() payload: SendResetPasswordLinkEmailPayload,
  ): Promise<void> {
    try {
      const frontendUrl = await this.configService.get('frontendUrl');

      const user = await this.coreService.findUserByEmail({
        email: payload.email,
      });

      const token = await this.authService.generateToken({
        user,
        type: TokenTypes.ResetPassword,
      });

      await this.coreService.setResetPasswordToken({
        email: payload.email,
        token,
      });

      this.notificationService.sendEmail({
        template: {
          key: emailTemplates.resetPassword,
          data: [
            {
              name: 'RESETURL',
              content: `${frontendUrl}/reset-password?token=${token.token}`,
            },
          ],
        },
        to: [{ email: payload.email, name: user.fullName }],
      });
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
