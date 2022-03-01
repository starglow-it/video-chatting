import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { CORE_PROVIDER } from '@shared/providers';
import {
  IUserCredentials,
  UserCredentialsWithTokenPair,
} from '@shared/types/registerUser.type';
import {
  ASSIGN_TOKENS_TO_USER,
  CREATE_USER,
  FIND_USER_BY_EMAIL,
  FIND_USER_BY_EMAIL_AND_UPDATE,
  FIND_USER_BY_ID,
  LOGIN_USER_BY_EMAIL,
} from '@shared/patterns/users';
import { USER_NOT_FOUND } from '@shared/const/errors/users';
import { DELETE_TOKEN } from '@shared/patterns/auth';
import { TokenPairWithUserType } from '@shared/types/token-pair-with-user.type';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { IToken } from '@shared/interfaces/token.interface';
import { AUTH_SERVICE } from '@shared/const/services.const';

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async createUser(
    data: UserCredentialsWithTokenPair,
  ): Promise<ICommonUserDTO> {
    const pattern = { cmd: CREATE_USER };

    return this.client.send(pattern, data).toPromise();
  }

  async findUserByEmail(data: { email: string }): Promise<ICommonUserDTO> {
    const pattern = { cmd: FIND_USER_BY_EMAIL };

    const user = await this.client.send(pattern, data).toPromise();

    if (!user) {
      throw new RpcException({ ...USER_NOT_FOUND, ctx: AUTH_SERVICE });
    }

    return user;
  }

  async findUserByEmailAndUpdate(data: {
    email: ICommonUserDTO['email'];
    data: Partial<ICommonUserDTO>;
  }): Promise<ICommonUserDTO> {
    const pattern = { cmd: FIND_USER_BY_EMAIL_AND_UPDATE };

    const user = await this.client.send(pattern, data).toPromise();

    if (!user) {
      throw new RpcException({ ...USER_NOT_FOUND, ctx: AUTH_SERVICE });
    }

    return user;
  }

  async deleteToken(data: IToken): Promise<void> {
    const pattern = { cmd: DELETE_TOKEN };

    return this.client.send(pattern, data).toPromise();
  }

  async loginUserByEmail(loginData: IUserCredentials): Promise<ICommonUserDTO> {
    const pattern = { cmd: LOGIN_USER_BY_EMAIL };

    return this.client.send(pattern, loginData).toPromise();
  }

  async assignTokensToUser(data: TokenPairWithUserType): Promise<void> {
    const pattern = { cmd: ASSIGN_TOKENS_TO_USER };

    return this.client.send(pattern, data).toPromise();
  }

  async findUserById(data: {
    userId: ICommonUserDTO['id'];
  }): Promise<ICommonUserDTO> {
    const pattern = { cmd: FIND_USER_BY_ID };

    return this.client.send(pattern, data).toPromise();
  }
}
