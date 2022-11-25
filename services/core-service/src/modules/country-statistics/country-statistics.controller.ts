import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';

import { CoreBrokerPatterns } from 'shared-const';
import { ICountryStatistic } from 'shared-types';

import { withTransaction } from '../../helpers/mongo/withTransaction';
import { CommonCountryStatisticDTO } from '../../dtos/common-user-statistic.dto';
import { CountryStatisticsService } from './country-statistics.service';

@Controller('country-statistics')
export class CountryStatisticsController {
  constructor(
    @InjectConnection() private connection: Connection,
    private countryStatisticsService: CountryStatisticsService,
  ) {}

  @MessagePattern({ cmd: CoreBrokerPatterns.GetCountryStatistics })
  async getCountryStatistics(
    @Payload() payload: any,
  ): Promise<ICountryStatistic[]> {
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
        ctx: 'COUNTRY_STATISTICS_SERVICE',
      });
    }
  }

  @MessagePattern({ cmd: CoreBrokerPatterns.UpdateCountryStatistics })
  async updateCountryStatistics(
    @Payload() payload: any,
  ): Promise<ICountryStatistic> {
    try {
      return withTransaction(this.connection, async (session) => {
        const countryStatistic = await this.countryStatisticsService.updateOne({
          query: {
            key: payload.key,
          },
          data: {
            $inc: { value: payload.value }
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
        ctx: 'COUNTRY_STATISTICS_SERVICE',
      });
    }
  }
}
