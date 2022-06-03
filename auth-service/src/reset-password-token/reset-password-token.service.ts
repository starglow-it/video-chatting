import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { TokenPayloadType } from '@shared/types/token-payload.type';
import { JWT_RESET_EXPIRE_IN_TIMESTAMP } from '@shared/const/jwt.const';
import { TokenTypes } from '@shared/const/tokens.const';
import { IToken } from '@shared/interfaces/token.interface';

@Injectable()
export class ResetPasswordTokenService {
  constructor(private jwtService: JwtService) {}

  async generateToken({
    user,
  }: {
    user: ICommonUserDTO;
  }): Promise<TokenPayloadType> {
    const token = await this.jwtService.signAsync({ userId: user.id });

    const expiresAt = Date.now() + JWT_RESET_EXPIRE_IN_TIMESTAMP;

    return {
      token,
      expiresAt,
      type: TokenTypes.ResetPassword,
    };
  }

  decodeToken(token: IToken) {
    const tokenData = this.jwtService.verify(token.token);

    if (tokenData.exp * 1000 < Date.now()) {
      throw new UnauthorizedException('invalid reset password token');
    }

    return tokenData;
  }
}
