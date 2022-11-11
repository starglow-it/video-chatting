import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MonetizationStatisticController } from './monetization-statistic.controller';
import { MonetizationStatisticService } from './monetization-statistic.service';
import {
  MonetizationStatistic,
  MonetizationStatisticSchema,
} from '../../schemas/monetization-statistic.schema';
import { TasksModule } from '../tasks/tasks.module';
import { PaymentsModule } from '../../services/payments/payments.module';

@Module({
  imports: [
    TasksModule,
    PaymentsModule,
    MongooseModule.forFeature([
      { name: MonetizationStatistic.name, schema: MonetizationStatisticSchema },
    ]),
  ],
  controllers: [MonetizationStatisticController],
  providers: [MonetizationStatisticService],
  exports: [MonetizationStatisticService],
})
export class MonetizationStatisticModule {}
