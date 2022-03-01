import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// shared
import { JWT_ACCESS_EXPIRE_IN_TIMESTAMP } from '@shared/const/jwt.const';
import { TokenTypes } from '@shared/const/tokens.const';
import { TokenPayloadType } from '@shared/types/token-payload.type';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';

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
}
