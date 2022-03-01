import { Injectable } from '@nestjs/common';

import { TokenPairWithUserType } from '@shared/types/token-pair-with-user.type';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';

import { ConfirmTokenService } from '../confirm-token/confirm-token.service';
import { AccessTokenService } from '../access-token/access-token.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private confirmTokenService: ConfirmTokenService,
    private accessTokenService: AccessTokenService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async generateAuthenticationTokens({
    user,
  }: {
    user: ICommonUserDTO;
  }): Promise<TokenPairWithUserType> {
    const accessToken = await this.accessTokenService.generateToken({ user });

    const refreshToken = await this.refreshTokenService.generateToken({ user });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
