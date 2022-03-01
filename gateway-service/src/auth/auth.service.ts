import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// shared
import { AUTH_PROVIDER } from '@shared/providers';
import {
  CONFIRM_REGISTRATION_PATTERN,
  LOGIN_USER,
  LOGOUT_USER,
  REFRESH_TOKEN,
  REGISTER_USER_PATTERN,
} from '@shared/patterns/auth';
import { ConfirmUser } from '@shared/types/confirmUser.type';
import { IUserCredentials } from '@shared/types/registerUser.type';
import { IToken } from '@shared/interfaces/token.interface';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async register(registerUserRequest: IUserCredentials) {
    const pattern = { cmd: REGISTER_USER_PATTERN };

    return this.client.send(pattern, registerUserRequest).toPromise();
  }

  async confirmRegister(
    confirmRegistrationRequest: ConfirmUser,
  ): Promise<void> {
    const pattern = { cmd: CONFIRM_REGISTRATION_PATTERN };

    return this.client.send(pattern, confirmRegistrationRequest).toPromise();
  }

  async loginUser(data: IUserCredentials) {
    const pattern = { cmd: LOGIN_USER };

    return this.client.send(pattern, data).toPromise();
  }

  async refreshToken(data: IToken) {
    const pattern = { cmd: REFRESH_TOKEN };

    return this.client.send(pattern, data).toPromise();
  }

  async logoutUser(data: IToken) {
    const pattern = { cmd: LOGOUT_USER };

    await this.client.send(pattern, data).toPromise();
  }
}
