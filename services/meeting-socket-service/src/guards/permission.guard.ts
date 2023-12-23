import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Socket } from 'socket.io';
import { MeetingNativeErrorEnum } from 'shared-const';
import { PASS_AUTH_KEY } from '../utils/decorators/passAuth.decorator';
import { ROLE } from '../utils/decorators/role.decorator';
import { MeetingRole } from 'shared-types';
import { UsersComponent } from '../modules/users/users.component';
import { SocketData } from '../types';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersComponent: UsersComponent,
  ) {}

  private getPassAuthKey(ctx: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride(PASS_AUTH_KEY, [
      ctx.getClass(),
      ctx.getHandler(),
    ]);
  }

  private getRoles(ctx: ExecutionContext): MeetingRole[] {
    return this.reflector.getAllAndMerge(ROLE, [
      ctx.getClass(),
      ctx.getHandler(),
    ]);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient() as Socket;
    const customData = client.data as SocketData;
    try {
      if (this.getPassAuthKey(context)) {
        return true;
      }

      const user = await this.usersComponent.findOne({
        query: {
          socketId: client.id,
        },
      });

      const roles = this.getRoles(context);
      if (roles.length && !roles.includes(user.meetingRole as MeetingRole)) {
        customData['error'] = MeetingNativeErrorEnum.USER_NOT_HAVE_PERMISSION;
      }

      customData['user'] = user;
      return true;
    } catch (err) {
      customData['error'] = err;
      return true;
    }
  }
}
