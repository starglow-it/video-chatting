import { Module } from '@nestjs/common';
import {
  Transport,
  ClientsModule,
  ClientProvider,
} from '@nestjs/microservices';

import { CORE_PROVIDER } from 'shared-const';

import { CoreService } from './core.service';
import { ConfigModule } from '../config/config.module';
import { ConfigClientService } from '../config/config.service';

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
            environment,
            rabbitMqHost,
            rabbitMqCoreQueue,
          } = await config.getAll();

          return {
            transport: Transport.RMQ,
            options: {
              urls: [
                environment == 'local'
                  ? `amqp://${rabbitMqUser}:${rabbitMqPass}@${rabbitMqHost}`
                  : `amqp://${rabbitMqUser}:${rabbitMqPass}@${rabbitMqCoreHost}:${rabbitMqCorePort}`,
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
