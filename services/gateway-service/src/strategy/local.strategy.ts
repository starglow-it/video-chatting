import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { INVALID_CREDENTIALS, USER_NOT_FOUND } from 'shared-const';
import {UsersService} from "../modules/users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    try {
      return await this.usersService.validateUser({
        email: username,
        password,
      });
    } catch (err) {
      if (
        [USER_NOT_FOUND.message, INVALID_CREDENTIALS.message].includes(
          err.message,
        )
      ) {
        throw new UnauthorizedException(err);
      }

      throw new BadRequestException(err);
    }
  }
}
