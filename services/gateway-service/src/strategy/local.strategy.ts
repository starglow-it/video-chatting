import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CoreService } from '../services/core/core.service';
import { INVALID_CREDENTIALS, USER_LOGIN_OTHER_PLATFORM, USER_NOT_FOUND } from 'shared-const';
import { LoginTypes } from 'shared-types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private coreService: CoreService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    try {
      return await this.coreService.validateUser({
        email: username,
        password,
      });
    } catch (err) {
      const errMessages = [
        USER_NOT_FOUND.message,
        INVALID_CREDENTIALS.message,
        ...[LoginTypes.Local, LoginTypes.Google].map(type => USER_LOGIN_OTHER_PLATFORM(type).message)
      ]
      if (
        errMessages.includes(
          err.message,
        )
      ) {
        throw new UnauthorizedException(err);
      }

      throw new BadRequestException(err);
    }
  }
}
