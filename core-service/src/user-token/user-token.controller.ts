import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DELETE_TOKEN } from '@shared/patterns/auth';
import { UserTokenService } from './user-token.service';
import {
  ASSIGN_TOKENS_TO_USER,
  USER_TOKEN_EXISTS,
} from '@shared/patterns/users';
import { TokenPairWithUserType } from '@shared/types/token-pair-with-user.type';
import { TokenTypes } from '@shared/const/tokens.const';
import { UsersService } from '../users/users.service';
import { plainToClass } from 'class-transformer';
import { CommonUserDTO } from '../dtos/common-user.dto';
import { withTransaction } from '../helpers/mongo/withTransaction';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { USERS_SERVICE } from '@shared/const/services.const';

@Controller('user-token')
export class UserTokenController {
  constructor(
    private userTokenService: UserTokenService,
    private usersService: UsersService,
    @InjectConnection() private connection: Connection,
  ) {}

  @MessagePattern({ cmd: DELETE_TOKEN })
  async deleteToken(data: { token: string }) {
    try {
      return withTransaction(this.connection, async (session) => {
        return await this.userTokenService.deleteToken(data, session);
      });
    } catch (err) {
      throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
    }
  }

  @MessagePattern({ cmd: USER_TOKEN_EXISTS })
  async checkIfUserTokenExists(@Payload() token: string) {
    try {
      return this.userTokenService.exists(token);
    } catch (err) {
      throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
    }
  }

  @MessagePattern({ cmd: ASSIGN_TOKENS_TO_USER })
  async assignTokensToUser(
    @Payload() { accessToken, refreshToken, user }: TokenPairWithUserType,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const userModel = await this.usersService.findUser({
          query: {
            email: user.email,
          },
          session,
        });

        await this.userTokenService.deleteUserTokens(
          { userId: userModel._id },
          session,
        );

        userModel.tokens = [];

        const accessTokenData = await this.userTokenService.createToken(
          {
            user: user.id,
            token: { ...accessToken, type: TokenTypes.Access },
          },
          session,
        );

        const refreshTokenData = await this.userTokenService.createToken(
          {
            user: user.id,
            token: { ...refreshToken, type: TokenTypes.Refresh },
          },
          session,
        );

        userModel.tokens.push(accessTokenData);
        userModel.tokens.push(refreshTokenData);

        await userModel.save();

        return plainToClass(CommonUserDTO, userModel, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
      }
    });
  }
}
