import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { CORE_PROVIDER, USER_NOT_FOUND, AUTH_SERVICE, CoreBrokerPatterns } from 'shared-const';

import { AuthBrokerPatterns, UserBrokerPatterns } from 'shared-const';

import {
  ICommonUser,
  CreateUserPayload,
  FindUserByEmailAndUpdatePayload,
  FindUserByEmailPayload,
  FindUserByIdPayload,
  LogOutUserPayload,
  AssignTokensToUserPayload,
  LoginUserByEmailPayload,
  SetResetPasswordTokenPayload,
  CreateMonitoringPayload,
} from 'shared-types';

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async createUser(payload: CreateUserPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.CreateUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUserByEmail(payload: FindUserByEmailPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.FindUserByEmail };

    const user = await this.client.send(pattern, payload).toPromise();

    if (!user) {
      throw new RpcException({ ...USER_NOT_FOUND, ctx: AUTH_SERVICE });
    }

    return user;
  }

  async findUserByEmailAndUpdate(
    payload: FindUserByEmailAndUpdatePayload,
  ): Promise<ICommonUser> {
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
  ): Promise<ICommonUser> {
    const pattern = { cmd: AuthBrokerPatterns.LoginUserByEmail };

    return this.client.send(pattern, payload).toPromise();
  }

  async assignTokensToUser(payload: AssignTokensToUserPayload): Promise<void> {
    const pattern = { cmd: AuthBrokerPatterns.AssignTokensToUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUserById(payload: FindUserByIdPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.FindUserById };

    return this.client.send(pattern, payload).toPromise();
  }

  async createMonitoring(payload: CreateMonitoringPayload){
    const pattern = { cmd: CoreBrokerPatterns.CreateMonitoring };
    return this.client.send(pattern, payload).toPromise();
  }

  async setResetPasswordToken(
    payload: SetResetPasswordTokenPayload,
  ): Promise<void> {
    const pattern = { cmd: AuthBrokerPatterns.SetResetPasswordToken };

    return this.client.send(pattern, payload).toPromise();
  }
}
