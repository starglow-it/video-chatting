import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UserTokenService } from './user-token.service';
import { UserBrokerPatterns } from 'shared';
import { TokenTypes } from 'shared';
import { UsersService } from '../users/users.service';
import { plainToInstance } from 'class-transformer';
import { CommonUserDTO } from '../../dtos/common-user.dto';
import { withTransaction } from '../../helpers/mongo/withTransaction';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { USERS_SERVICE } from 'shared';
import { AuthBrokerPatterns } from 'shared';
import { AssignTokensToUserPayload, LogOutUserPayload } from 'shared';
import { UserTokenExistsPayload } from 'shared';

@Controller('user-token')
export class UserTokenController {
  constructor(
    private userTokenService: UserTokenService,
    private usersService: UsersService,
    @InjectConnection() private connection: Connection,
  ) {}

  @MessagePattern({ cmd: AuthBrokerPatterns.DeleteToken })
  async deleteToken(@Payload() data: LogOutUserPayload) {
    try {
      return withTransaction(this.connection, async (session) => {
        return await this.userTokenService.deleteToken(data, session);
      });
    } catch (err) {
      throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
    }
  }

  @MessagePattern({ cmd: UserBrokerPatterns.UserTokenExists })
  async checkIfUserTokenExists(@Payload() payload: UserTokenExistsPayload) {
    try {
      return this.userTokenService.exists(payload);
    } catch (err) {
      throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
    }
  }

  @MessagePattern({ cmd: AuthBrokerPatterns.AssignTokensToUser })
  async assignTokensToUser(
    @Payload() { accessToken, refreshToken, user }: AssignTokensToUserPayload,
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

        return plainToInstance(CommonUserDTO, userModel, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
      }
    });
  }
}
