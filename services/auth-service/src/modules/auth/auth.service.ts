import { Injectable } from '@nestjs/common';

import {
  TokenPairWithUserType,
  ICommonUserDTO,
  TokenTypes,
  TokenPayloadType,
  IToken,
} from 'shared';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(private tokensService: TokensService) {}

  async generateAuthenticationTokens({
    user,
  }: {
    user: ICommonUserDTO;
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
    user?: ICommonUserDTO;
    email?: ICommonUserDTO['email'];
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
