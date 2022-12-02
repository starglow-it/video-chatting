import { Controller } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

// shared
import { StatisticBrokerPatterns } from 'shared-const';
import {
  GetRoomRatingStatisticPayload,
  UpdateRoomRatingStatisticPayload,
} from 'shared-types';

// helpers
import { withTransaction } from '../../helpers/mongo/withTransaction';

// services
import { RoomsStatisticsService } from './rooms-statistics.service';

// dtos
import { RoomRatingStatisticDTO } from '../../dtos/room-statistic.dto';

@Controller('rooms-statistics')
export class RoomsStatisticsController {
  constructor(
    @InjectConnection() private connection: Connection,
    private roomsStatisticService: RoomsStatisticsService,
  ) {}

  @MessagePattern({ cmd: StatisticBrokerPatterns.GetRoomRatingStatistic })
  async getRoomRatingStatistics(
    @Payload() payload: GetRoomRatingStatisticPayload,
  ) {
    try {
      const roomStatistics = await this.roomsStatisticService.aggregate([
        {
          $lookup: {
            from: 'commontemplates',
            localField: 'template',
            foreignField: '_id',
            as: 'template',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $match: {
            'template.isDeleted': false,
            author:
              payload.roomKey === 'custom'
                ? { $not: { $size: 0 } }
                : { $size: 0 },
          },
        },
        {
          $sort: { [payload.ratingKey]: -1 },
        },
        {
          $limit: 10,
        },
      ]);

      return plainToInstance(RoomRatingStatisticDTO, roomStatistics, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: 'ROOMS_STATISTICS_SERVICE',
      });
    }
  }

  @MessagePattern({
    cmd: StatisticBrokerPatterns.UpdateRoomRatingStatistic,
  })
  async updateRoomRatingStatistic(
    @Payload() payload: UpdateRoomRatingStatisticPayload,
  ): Promise<any> {
    try {
      return withTransaction(this.connection, async (session) => {
        const isStatisticExists = await this.roomsStatisticService.exists({
          query: { template: payload.templateId },
        });

        let roomStatistic;

        if (isStatisticExists) {
          roomStatistic = await this.roomsStatisticService.updateOne({
            query: {
              template: payload.templateId,
            },
            data: {
              $inc: { [payload.ratingKey]: payload.value },
            },
            session,
          });
        } else {
          roomStatistic = await this.roomsStatisticService.create({
            data: {
              template: payload.templateId,
              author: payload.userId,
              transactions: 0,
              minutes: 0,
              calls: 0,
              money: 0,
              uniqueUsers: 0,
              ...{ [payload.ratingKey]: payload.value },
            },
            session,
          });
        }

        return plainToInstance(RoomRatingStatisticDTO, roomStatistic, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: 'ROOMS_STATISTICS_SERVICE',
      });
    }
  }
}
