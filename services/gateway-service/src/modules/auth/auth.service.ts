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
} from 'shared-types';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async register(payload: RegisterUserPayload) {
    const pattern = { cmd: AuthBrokerPatterns.RegisterUserPattern };

    return this.client.send(pattern, payload).toPromise();
  }

  async confirmRegister(payload: IToken): Promise<void> {
    const pattern = { cmd: AuthBrokerPatterns.ConfirmRegistration };

    return this.client.send(pattern, payload).toPromise();
  }

  async loginUser(payload: LoginUserByEmailPayload) {
    const pattern = { cmd: AuthBrokerPatterns.LoginUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async refreshToken(payload: RefreshTokenPayload) {
    const pattern = { cmd: AuthBrokerPatterns.RefreshToken };

    return this.client.send(pattern, payload).toPromise();
  }

  async logoutUser(payload: LogOutUserPayload) {
    const pattern = { cmd: AuthBrokerPatterns.LogOutUser };

    await this.client.send(pattern, payload).toPromise();
  }

  async sendResetPassword(payload: SendResetPasswordLinkEmailPayload) {
    const pattern = { cmd: AuthBrokerPatterns.SendResetPasswordLink };

    await this.client.send(pattern, payload).toPromise();
  }
}
