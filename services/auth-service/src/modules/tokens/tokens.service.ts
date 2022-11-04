import { Injectable } from '@nestjs/common';
import { ConfirmTokenService } from './confirm-token/confirm-token.service';
import { AccessTokenService } from './access-token/access-token.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { ResetPasswordTokenService } from './reset-password-token/reset-password-token.service';
import {
  TokenTypes,
  TokenPayloadType,
  ICommonUser,
  IToken,
} from 'shared-types';

@Injectable()
export class TokensService {
  constructor(
    private confirmTokenService: ConfirmTokenService,
    private accessTokenService: AccessTokenService,
    private refreshTokenService: RefreshTokenService,
    private resetPasswordTokenService: ResetPasswordTokenService,
  ) {}

  async generateToken(data: {
    type: TokenTypes;
    user?: ICommonUser;
    email?: ICommonUser['email'];
  }): Promise<TokenPayloadType> {
    if (data.type === TokenTypes.Access)
      return this.accessTokenService.generateToken({ user: data.user });
    if (data.type === TokenTypes.Refresh)
      return this.refreshTokenService.generateToken({ user: data.user });
    if (data.type === TokenTypes.Confirm)
      return this.confirmTokenService.generateToken({ email: data.email });
    if (data.type === TokenTypes.ResetPassword)
      return this.resetPasswordTokenService.generateToken({ user: data.user });
  }

  async validateToken(data: { type: TokenTypes; token: string }) {
    if (data.type === TokenTypes.Access)
      return this.accessTokenService.validateToken({ token: data.token });
    if (data.type === TokenTypes.Refresh)
      return this.refreshTokenService.validateToken({ token: data.token });
    if (data.type === TokenTypes.Confirm)
      return this.confirmTokenService.validateToken({ token: data.token });
    if (data.type === TokenTypes.ResetPassword)
      return this.resetPasswordTokenService.validateToken({
        token: data.token,
      });
  }

  decodeToken(data: { token: IToken; type: TokenTypes }): any {
    if (data.type === TokenTypes.Access)
      return this.accessTokenService.decodeToken(data.token);
    if (data.type === TokenTypes.Refresh)
      return this.refreshTokenService.decodeToken(data.token);
    if (data.type === TokenTypes.Confirm)
      return this.confirmTokenService.decodeToken(data.token);
    if (data.type === TokenTypes.ResetPassword)
      return this.resetPasswordTokenService.decodeToken(data.token);
  }
}
