import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';

// shared
import {CoreBrokerPatterns, COUNTRY_STATISTICS_SERVICE, StatisticBrokerPatterns} from 'shared-const';
import {
  ICountryStatistic,
  UpdateCountryStatisticsPayload,
} from 'shared-types';

// services
import { CountryStatisticsService } from './country-statistics.service';

// dtos
import { CommonCountryStatisticDTO } from '../../dtos/common-user-statistic.dto';

// helpers
import { withTransaction } from '../../helpers/mongo/withTransaction';

@Controller('country-statistics')
export class CountryStatisticsController {
  constructor(
    @InjectConnection() private connection: Connection,
    private countryStatisticsService: CountryStatisticsService,
  ) {}

  @MessagePattern({ cmd: CoreBrokerPatterns.GetCountryStatistics })
  async getCountryStatistics(): Promise<ICountryStatistic[]> {
    try {
      return withTransaction(this.connection, async (session) => {
        const countryStatistics = await this.countryStatisticsService.find({
          query: {},
          options: {
            sort: '-value',
          },
          session,
        });

        return plainToInstance(CommonCountryStatisticDTO, countryStatistics, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: COUNTRY_STATISTICS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: StatisticBrokerPatterns.UpdateCountryStatistics })
  async updateCountryStatistics(
    @Payload() payload: UpdateCountryStatisticsPayload,
  ): Promise<ICountryStatistic> {
    try {
      return withTransaction(this.connection, async (session) => {
        const countryStatistic = await this.countryStatisticsService.updateOne({
          query: {
            key: payload.key,
          },
          data: {
            $inc: { value: payload.value },
          },
          session,
        });

        return plainToInstance(CommonCountryStatisticDTO, countryStatistic, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: COUNTRY_STATISTICS_SERVICE,
      });
    }
  }
}
