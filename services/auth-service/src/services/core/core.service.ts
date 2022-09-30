import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { CORE_PROVIDER } from '@shared/providers';
import { USER_NOT_FOUND } from '@shared/const/errors/users';
import { AUTH_SERVICE } from '@shared/const/services.const';

// patterns
import { AuthBrokerPatterns } from '@shared/patterns/auth';
import { UserBrokerPatterns } from '@shared/patterns/users';

// interfaces
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';

// payloads
import {
  CreateUserPayload,
  FindUserByEmailAndUpdatePayload,
  FindUserByEmailPayload,
  FindUserByIdPayload,
} from '@shared/broker-payloads/users';
import {
  AssignTokensToUserPayload,
  LoginUserByEmailPayload,
  LogOutUserPayload,
  SetResetPasswordTokenPayload,
} from '@shared/broker-payloads/auth';

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async createUser(payload: CreateUserPayload): Promise<ICommonUserDTO> {
    const pattern = { cmd: UserBrokerPatterns.CreateUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUserByEmail(
    payload: FindUserByEmailPayload,
  ): Promise<ICommonUserDTO> {
    const pattern = { cmd: UserBrokerPatterns.FindUserByEmail };

    const user = await this.client.send(pattern, payload).toPromise();

    if (!user) {
      throw new RpcException({ ...USER_NOT_FOUND, ctx: AUTH_SERVICE });
    }

    return user;
  }

  async findUserByEmailAndUpdate(
    payload: FindUserByEmailAndUpdatePayload,
  ): Promise<ICommonUserDTO> {
    const pattern = { cmd: UserBrokerPatterns.FindUserByEmailAndUpdate };

    const user = await this.client.send(pattern, payload).toPromise();

    if (!user) {
      throw new RpcException({ ...USER_NOT_FOUND, ctx: AUTH_SERVICE });
    }

    return user;
  }

  async deleteToken(payload: LogOutUserPayload): Promise<void> {
    const pattern = { cmd: AuthBrokerPatterns.DeleteToken };

    return this.client.send(pattern, payload).toPromise();
  }

  async loginUserByEmail(
    payload: LoginUserByEmailPayload,
  ): Promise<ICommonUserDTO> {
    const pattern = { cmd: AuthBrokerPatterns.LoginUserByEmail };

    return this.client.send(pattern, payload).toPromise();
  }

  async assignTokensToUser(payload: AssignTokensToUserPayload): Promise<void> {
    const pattern = { cmd: AuthBrokerPatterns.AssignTokensToUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUserById(payload: FindUserByIdPayload): Promise<ICommonUserDTO> {
    const pattern = { cmd: UserBrokerPatterns.FindUserById };

    return this.client.send(pattern, payload).toPromise();
  }

  async setResetPasswordToken(
    payload: SetResetPasswordTokenPayload,
  ): Promise<void> {
    const pattern = { cmd: AuthBrokerPatterns.SetResetPasswordToken };

    return this.client.send(pattern, payload).toPromise();
  }
}
