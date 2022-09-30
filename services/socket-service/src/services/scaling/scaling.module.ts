import { Module } from '@nestjs/common';
import {
  Transport,
  ClientsModule,
  ClientProvider,
} from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

import { ScalingService } from './scaling.service';
import { ConfigClientService } from '../config/config.service';

import { SCALING_PROVIDER } from '@shared/providers';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SCALING_PROVIDER,
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
              queue: allConfig.rabbitMqScalingQueue,
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
  providers: [ScalingService],
  exports: [ScalingService],
})
export class ScalingModule {}
