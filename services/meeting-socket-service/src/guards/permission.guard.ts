import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../modules/users/users.service';
import { Socket } from 'socket.io';
import { throwWsError } from '../utils/ws/wsError';
import { MeetingNativeErrorEnum } from 'shared-const';
import { PASS_AUTH_KEY } from '../utils/decorators/passAuth.decorator';
import { ROLE } from 'src/utils/decorators/role.decorator';
import { MeetingRole } from 'shared-types';
import { UsersComponent } from '../modules/users/users.component';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersComponent: UsersComponent,
  ) {}

  private getPassAuthKey(ctx: ExecutionContext): Boolean {
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

    if (this.getPassAuthKey(context)) {
      return true;
    }

    const user = await this.usersComponent.findOne({
      query: {
        socketId: client.id,
      },
    });

    const roles = this.getRoles(context);
    throwWsError(
      roles.length && !roles.includes(user.meetingRole as MeetingRole),
      MeetingNativeErrorEnum.USER_NOT_HAVE_PERMISSION,
    );

    client.data['user'] = user;

    return true;
  }
}
