import { Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// shared
import { StatisticBrokerPatterns } from 'shared-const';
import {
  GetUserProfileStatisticPayload,
  UpdateUserProfileStatisticPayload,
} from 'shared-types';

import { withTransaction } from '../../helpers/mongo/withTransaction';

// services
import { UserProfileStatisticService } from './user-profile-statistic.service';

@Controller('user-profile-statistic')
export class UserProfileStatisticController {
  private readonly logger = new Logger(UserProfileStatisticController.name);

  constructor(
    @InjectConnection() private connection: Connection,
    private userProfileStatisticService: UserProfileStatisticService,
  ) {}

  @MessagePattern({
    cmd: StatisticBrokerPatterns.GetUserProfileStatistic,
  })
  async getUserProfileStatistic(
    @Payload() payload: GetUserProfileStatisticPayload,
  ) {
    try {
      return withTransaction(this.connection, async (session) => {
        return this.userProfileStatisticService.find({
          query: { user: payload.userId },
          session,
        });
      });
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get user profile statistic`,
        },
        JSON.stringify(err),
      );
      throw new RpcException({
        message: err.message,
        ctx: 'MONETIZATION_STATISTICS_SERVICE',
      });
    }
  }

  @MessagePattern({
    cmd: StatisticBrokerPatterns.UpdateUserProfileStatistic,
  })
  async updateUserProfileStatistic(
    @Payload() payload: UpdateUserProfileStatisticPayload,
  ) {
    try {
      return withTransaction(this.connection, async (session) => {
        return this.userProfileStatisticService.updateOne({
          query: { user: new Types.ObjectId(payload.userId) },
          data: {
            $inc: { [payload.statisticKey]: payload.value },
          },
          session,
        });
      });
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while update user profile statistic`,
        },
        JSON.stringify(err),
      );
      throw new RpcException({
        message: err.message,
        ctx: 'USER_STATISTICS_SERVICE',
      });
    }
  }
}
