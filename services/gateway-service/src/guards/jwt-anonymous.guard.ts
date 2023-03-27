import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'shared-types';
import { CoreService } from '../services/core/core.service';

type TokenDataDto = { userId: string; exp: number };

@Injectable()
export class JwtAuthAnonymousGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private coreService: CoreService
  ) { }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest<Request>();

    let token: string;
    let userWithoutLoginId: string;

    const cookies = request['cookies'];

    if (cookies && cookies.userWithoutLoginId && !cookies.accessToken) {
      const user = await this.coreService.findUserById({ userId: cookies.userWithoutLoginId });
      if (user.role === UserRoles.Anonymous) {
        request['user'] = {
          userId: user.id,
          exp: 1000000000000
        };
        return true;
      }
    }



    if (cookies && cookies.accessToken) {
      token = cookies.accessToken;
    } else {
      const authHeader = request.headers['authorization'];
      if (!authHeader) {
        throw new UnauthorizedException();
      }
      const [authType, accessToken] = authHeader.split(' ');
      if (authType !== 'Bearer' || !accessToken) {
        throw new UnauthorizedException();
      }
      token = accessToken;
    }

    let tokenData: TokenDataDto;
    try {
      tokenData = this.jwtService.verify(token) as TokenDataDto;
    } catch (error) {
      throw new UnauthorizedException();
    }

    const userToken = await this.coreService.checkIfUserTokenExists(token);

    if (!tokenData?.userId || !tokenData?.exp || !userToken) {
      throw new UnauthorizedException();
    }

    if (tokenData.exp * 1000 < Date.now()) {
      throw new UnauthorizedException('Token has expired');
    }

    request['user'] = tokenData;
    return true;
  }
}
