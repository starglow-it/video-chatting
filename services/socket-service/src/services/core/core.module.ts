import { Module } from '@nestjs/common';
import {
  Transport,
  ClientsModule,
  ClientProvider,
} from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

import { CoreService } from './core.service';
import { CoreController } from './core.controller';
import { ConfigClientService } from '../config/config.service';

import { CORE_PROVIDER } from '@shared/providers';

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
          const allConfig = await config.getAll();

          return {
            transport: Transport.RMQ,
            options: {
              urls: [
                `amqp://${allConfig.rabbitMqUser}:${allConfig.rabbitMqPass}@${allConfig.rabbitMqHost}`,
              ],
              queue: allConfig.rabbitMqCoreQueue,
              queueOptions: {
                durable: false,
              },
            },
          };
        },
      },
    ]),
  ],
  controllers: [CoreController],
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}
