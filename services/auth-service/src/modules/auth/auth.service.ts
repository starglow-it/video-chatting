import { Injectable } from '@nestjs/common';

import {
  TokenPairWithUserType,
  ICommonUser,
  TokenTypes,
  TokenPayloadType,
  IToken,
} from 'shared-types';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(private tokensService: TokensService) {}

  async generateAuthenticationTokens({
    user,
  }: {
    user: ICommonUser;
  }): Promise<TokenPairWithUserType> {
    const accessToken = await this.tokensService.generateToken({
      user,
      type: TokenTypes.Access,
    });

    const refreshToken = await this.tokensService.generateToken({
      user,
      type: TokenTypes.Refresh,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async generateToken(data: {
    type: TokenTypes;
    user?: ICommonUser;
    email?: ICommonUser['email'];
  }): Promise<TokenPayloadType> {
    return this.tokensService.generateToken(data);
  }

  async validateToken(data: { type: TokenTypes; token: string }): Promise<any> {
    return this.tokensService.validateToken(data);
  }

  decodeToken(data: { token: IToken; type: TokenTypes }): any {
    return this.tokensService.decodeToken(data);
  }
}
