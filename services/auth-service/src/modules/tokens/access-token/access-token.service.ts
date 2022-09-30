import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// shared
import { JWT_ACCESS_EXPIRE_IN_TIMESTAMP } from '@shared/const/jwt.const';
import { TokenTypes } from '@shared/const/tokens.const';
import { TokenPayloadType } from '@shared/types/token-payload.type';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { RpcException } from '@nestjs/microservices';
import { NOT_VALID_TOKEN } from '@shared/const/errors/tokens';
import { AUTH_SERVICE } from '@shared/const/services.const';
import { IToken } from '@shared/interfaces/token.interface';

@Injectable()
export class AccessTokenService {
  constructor(private jwtService: JwtService) {}

  async generateToken({
    user,
  }: {
    user: ICommonUserDTO;
  }): Promise<TokenPayloadType> {
    const token = await this.jwtService.signAsync({
      userId: user.id,
      email: user.email,
    });

    const expiresAt = Date.now() + JWT_ACCESS_EXPIRE_IN_TIMESTAMP;

    return {
      token,
      expiresAt,
      type: TokenTypes.Access,
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
        ctx: AUTH_SERVICE,
      });
    }

    return tokenData;
  }

  decodeToken(token: IToken) {
    const tokenData = this.jwtService.verify(token.token);

    if (tokenData.exp * 1000 < Date.now()) {
      throw new UnauthorizedException('invalid access token');
    }

    return tokenData;
  }
}
