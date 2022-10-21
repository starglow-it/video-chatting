import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  AUTH_SERVICE,
  JWT_REFRESH_EXPIRE_IN_TIMESTAMP,
  TokenPayloadType,
  TokenTypes,
  IToken,
  ICommonUserDTO,
  NOT_VALID_TOKEN,
} from 'shared';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RefreshTokenService {
  constructor(private jwtService: JwtService) {}

  async generateToken({
    user,
  }: {
    user: ICommonUserDTO;
  }): Promise<TokenPayloadType> {
    const token = await this.jwtService.signAsync({ userId: user.id });

    const expiresAt = Date.now() + JWT_REFRESH_EXPIRE_IN_TIMESTAMP;

    return {
      token,
      expiresAt,
      type: TokenTypes.Refresh,
    };
  }

  decodeToken(token: IToken) {
    const tokenData = this.jwtService.verify(token.token);

    if (tokenData.exp * 1000 < Date.now()) {
      throw new UnauthorizedException('invalid refresh token');
    }

    return tokenData;
  }

  async validateToken({
    token,
  }: {
    token: string;
  }): Promise<{ email: string; jwtId: string }> {
    const tokenData = await this.jwtService.verify(token);

    if (!tokenData) {
      throw new RpcException({ ...NOT_VALID_TOKEN, ctx: AUTH_SERVICE });
    }

    const now = Date.now();

    if (tokenData.exp * 1000 < now) {
      throw new RpcException({
        ctx: AUTH_SERVICE,
      });
    }

    return tokenData;
  }
}
