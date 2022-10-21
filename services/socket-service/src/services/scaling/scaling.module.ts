import { Module } from '@nestjs/common';
import {
  Transport,
  ClientsModule,
  ClientProvider,
} from '@nestjs/microservices';

import { ScalingService } from './scaling.service';
import { ConfigClientService } from '../config/config.service';

import { SCALING_PROVIDER } from 'shared';
import {ConfigModule} from "../config/config.module";

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
