import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

type TokenDataDto = { userId: string; exp: number; role: 'admin' | 'user' };

@Injectable()
export class JwtAdminAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = ctx.switchToHttp().getRequest<Request>();

    let token: string;

    const cookies = request['cookies'];
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
    if (!tokenData?.userId || !tokenData?.exp) {
      throw new UnauthorizedException();
    }
    if (tokenData.exp * 1000 < Date.now()) {
      throw new UnauthorizedException('Token has expired');
    }

    if (tokenData.role !== 'admin') {
      throw new UnauthorizedException();
    }

    request['user'] = tokenData;
    return true;
  }
}
