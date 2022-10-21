import { Module } from '@nestjs/common';
import {
  Transport,
  ClientsModule,
  ClientProvider,
} from '@nestjs/microservices';

import { CoreService } from './core.service';
import { ConfigClientService } from '../config/config.service';

import { CORE_PROVIDER } from 'shared';
import {ConfigModule} from "../config/config.module";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CORE_PROVIDER,
        imports: [ConfigModule],
        inject: [ConfigClientService],
        useFactory: async (
          config: ConfigClientService,
        ): Promise<ClientProvider> => {
          const {
            rabbitMqUser,
            rabbitMqPass,
            rabbitMqCoreHost,
            rabbitMqCorePort,
            rabbitMqCoreQueue,
          } = await config.getAll();

          return {
            transport: Transport.RMQ,
            options: {
              urls: [
                `amqp://${rabbitMqUser}:${rabbitMqPass}@${rabbitMqCoreHost}:${rabbitMqCorePort}`,
              ],
              queue: rabbitMqCoreQueue,
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
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}
