import { Module } from '@nestjs/common';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

import { PAYMENTS_PROVIDER } from 'shared';

import { PaymentsService } from './payments.service';
import { ConfigClientService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PAYMENTS_PROVIDER,
        imports: [ConfigModule],
        inject: [ConfigClientService],
        useFactory: async (
          config: ConfigClientService,
        ): Promise<ClientProvider> => {
          const allConfig = await config.getAll();

          return {
            transport: Transport.RMQ,
            options: {
              urls: [
                `amqp://${allConfig.rabbitMqUser}:${allConfig.rabbitMqPass}@${allConfig.rabbitMqHost}`,
              ],
              queue: allConfig.rabbitMqPaymentQueue,
              queueOptions: {
                durable: false,
              },
            },
          };
        },
      },
    ]),
  ],
  controllers: [],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
