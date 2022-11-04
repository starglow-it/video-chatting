import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as uuid from 'uuid';
import { RpcException } from '@nestjs/microservices';

// shared
import {
  JWT_CONFIRM_EXPIRES_IN_TIMESTAMP,
  CONFIRM_TOKEN_HAS_EXPIRED,
  NOT_VALID_TOKEN,
  AUTH_SERVICE,
} from 'shared-const';

import {
  TokenTypes,
  TokenPayloadType,
  ICommonUser,
  IToken,
} from 'shared-types';

@Injectable()
export class ConfirmTokenService {
  constructor(private jwtService: JwtService) {}

  async generateToken({
    email,
  }: {
    email: ICommonUser['email'];
  }): Promise<TokenPayloadType> {
    const jwtId = uuid.v4();
    const confirmTokenPayload = { jwtId, email };

    const confirmToken = await this.jwtService.signAsync(confirmTokenPayload);

    const expiresAt = Date.now() + JWT_CONFIRM_EXPIRES_IN_TIMESTAMP;

    return {
      type: TokenTypes.Confirm,
      token: confirmToken,
      expiresAt,
    };
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
        ...CONFIRM_TOKEN_HAS_EXPIRED,
        ctx: AUTH_SERVICE,
      });
    }

    return tokenData;
  }

  decodeToken(token: IToken) {
    const tokenData = this.jwtService.verify(token.token);

    if (tokenData.exp * 1000 < Date.now()) {
      throw new UnauthorizedException('invalid confirm token');
    }

    return tokenData;
  }
}
