import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../modules/users/users.service';
import { Socket } from 'socket.io';
import { throwWsError } from '../utils/ws/wsError';
import { MeetingNativeErrorEnum } from 'shared-const';
import { PASS_AUTH_KEY } from '../utils/decorators/passAuth.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  private getPassAuthKey(ctx: ExecutionContext) {
    return this.reflector.getAllAndOverride(PASS_AUTH_KEY, [
      ctx.getClass(),
      ctx.getHandler(),
    ]);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient() as Socket;
    console.log('client guard', client.id);

    if (this.getPassAuthKey(context)) {
      return true;
    }

    const user = await this.usersService.findOne({
      query: {
        socketId: client.id,
      },
    });

    throwWsError(!user, MeetingNativeErrorEnum.USER_NOT_FOUND);

    console.log('user guard', user);

    return false;
  }
}
