import { Module } from '@nestjs/common';
import {
  Transport,
  ClientsModule,
  ClientProvider,
} from '@nestjs/microservices';

import { SocketService } from './socket.service';
import { SocketController } from './socket.controller';
import { ConfigClientService } from '../config/config.service';

import { SOCKET_PROVIDER } from 'shared-const';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SOCKET_PROVIDER,
        imports: [ConfigModule],
        inject: [ConfigClientService],
        useFactory: async (
          config: ConfigClientService,
        ): Promise<ClientProvider> => {
          const {
            rabbitMqUser,
            rabbitMqPass,
            rabbitMqHost,
            rabbitMqSocketQueue,
          } = await config.getAll();

          return {
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${rabbitMqUser}:${rabbitMqPass}@${rabbitMqHost}`],
              queue: rabbitMqSocketQueue,
              queueOptions: {
                durable: false,
              },
            },
          };
        },
      },
    ]),
  ],
  controllers: [SocketController],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
