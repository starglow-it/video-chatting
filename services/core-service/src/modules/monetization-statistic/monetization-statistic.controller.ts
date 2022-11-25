import { Controller, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import {
  UpdateMonetizationStatisticPayload,
  GetMonetizationStatisticPayload,
  TimeoutTypesEnum,
  MonetizationStatisticPeriods,
  MonetizationStatisticTypes,
} from 'shared-types';
import { subtractMonths } from 'shared-utils';
import { StatisticBrokerPatterns } from 'shared-const';

import { withTransaction } from '../../helpers/mongo/withTransaction';
import { MonetizationStatisticService } from './monetization-statistic.service';
import { MonetizationStatisticDTO } from '../../dtos/monetization-statistic.dto';
import { getTimeoutTimestamp } from '../../utils/getTimeoutTimestamp';
import { TasksService } from '../tasks/tasks.service';
import { PaymentsService } from '../../services/payments/payments.service';

@Controller('monetization-statistic')
export class MonetizationStatisticController {
  private readonly logger = new Logger(MonetizationStatisticController.name);

  constructor(
    @InjectConnection() private connection: Connection,
    private monetizationStatisticService: MonetizationStatisticService,
    private tasksService: TasksService,
    private paymentService: PaymentsService,
  ) {}

  startCheckLastMonthMonetization() {
    this.tasksService.addInterval({
      name: 'checkLastMonthMonetizationStatistics',
      ts: getTimeoutTimestamp({
        value: 1,
        type: TimeoutTypesEnum.Days,
      }),
      callback: this.checkLastMonthMonetization.bind(this),
    });
    this.checkLastMonthMonetization();
  }

  async checkLastMonthMonetization() {
    this.logger.debug('Start check last month monetization');

    const transactionChargesAmount = await this.paymentService.getStripeCharges({
      time: subtractMonths(Date.now(), 1),
      type: 'transactions',
    });

    const roomsPurchaseChargesAmount = await this.paymentService.getStripeCharges({
      time: subtractMonths(Date.now(), 1),
      type: 'roomsPurchase',
    });

    const subscriptionsChargesAmount = await this.paymentService.getStripeCharges({
      time: subtractMonths(Date.now(), 1),
      type: 'subscription',
    });

    return withTransaction(this.connection, async (session) => {
      await this.monetizationStatisticService.updateOne({
        query: {
          key: MonetizationStatisticPeriods.Month,
          type: MonetizationStatisticTypes.Subscriptions,
        },
        data: { value: subscriptionsChargesAmount },
        session,
      });

      await this.monetizationStatisticService.updateOne({
        query: {
          key: MonetizationStatisticPeriods.Month,
          type: MonetizationStatisticTypes.PurchaseRooms,
        },
        data: { value: roomsPurchaseChargesAmount },
        session,
      });

      await this.monetizationStatisticService.updateOne({
        query: {
          key: MonetizationStatisticPeriods.Month,
          type: MonetizationStatisticTypes.RoomTransactions,
        },
        data: { value: transactionChargesAmount },
        session,
      });
    });
  }

  @MessagePattern({
    cmd: StatisticBrokerPatterns.UpdateMonetizationStatistic,
  })
  async updateMonetizationStatistic(
    @Payload() payload: UpdateMonetizationStatisticPayload,
  ): Promise<any> {
    try {
      return withTransaction(this.connection, async (session) => {
        const monetization = await this.monetizationStatisticService.updateOne({
          query: {
            key: payload.period,
            type: payload.type,
          },
          data: {
            $inc: { value: payload.value },
          },
          session,
        });

        return plainToInstance(MonetizationStatisticDTO, monetization, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while update monetization statistic`,
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
    cmd: StatisticBrokerPatterns.GetMonetizationStatistic,
  })
  async getMonetizationStatistic(
    @Payload() payload: GetMonetizationStatisticPayload,
  ): Promise<any> {
    try {
      return withTransaction(this.connection, async (session) => {
        const firstPartQueryType =
          payload.type === 'platform'
            ? MonetizationStatisticTypes.PurchaseRooms
            : MonetizationStatisticTypes.SellRooms;
        const secondPartQueryType =
          payload.type === 'platform'
            ? MonetizationStatisticTypes.Subscriptions
            : MonetizationStatisticTypes.RoomTransactions;

        const [firstPartMonetization] =
          await this.monetizationStatisticService.find({
            query: {
              key: payload.period,
              type: firstPartQueryType,
            },
            session,
          });

        const [secondPartMonetization] =
          await this.monetizationStatisticService.find({
            query: {
              key: payload.period,
              type: secondPartQueryType,
            },
            session,
          });

        return {
          data: [
            {
              color: '#FF884E',
              label: firstPartQueryType,
              value: firstPartMonetization?.value ?? 0,
            },
            {
              color: '#2E6DF2',
              label: secondPartQueryType,
              value: secondPartMonetization?.value ?? 0,
            },
          ],
          totalNumber:
            (firstPartMonetization?.value ?? 0) +
            (secondPartMonetization?.value ?? 0),
        };
      });
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while update monetization statistic`,
        },
        JSON.stringify(err),
      );
      throw new RpcException({
        message: err.message,
        ctx: 'MONETIZATION_STATISTICS_SERVICE',
      });
    }
  }
}
