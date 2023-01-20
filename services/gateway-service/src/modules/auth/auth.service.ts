import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// shared
import { AUTH_PROVIDER } from 'shared-const';
import { AuthBrokerPatterns } from 'shared-const';

import {
  SendResetPasswordLinkEmailPayload,
  LogOutUserPayload,
  RegisterUserPayload,
  LoginUserByEmailPayload,
  RefreshTokenPayload,
  IToken,
  ICommonUser,
  TokenPairWithUserType,
} from 'shared-types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async register(payload: RegisterUserPayload): Promise<ICommonUser> {
    const pattern = { cmd: AuthBrokerPatterns.RegisterUserPattern };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async confirmRegister(payload: IToken): Promise<ICommonUser> {
    const pattern = { cmd: AuthBrokerPatterns.ConfirmRegistration };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async loginUser(
    payload: LoginUserByEmailPayload,
  ): Promise<TokenPairWithUserType> {
    const pattern = { cmd: AuthBrokerPatterns.LoginUser };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async refreshToken(
    payload: RefreshTokenPayload,
  ): Promise<TokenPairWithUserType> {
    const pattern = { cmd: AuthBrokerPatterns.RefreshToken };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async logoutUser(payload: LogOutUserPayload): Promise<void> {
    const pattern = { cmd: AuthBrokerPatterns.LogOutUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async sendResetPassword(
    payload: SendResetPasswordLinkEmailPayload,
  ): Promise<void> {
    const pattern = { cmd: AuthBrokerPatterns.SendResetPasswordLink };

    return firstValueFrom(this.client.send(pattern, payload));
  }
}
