import { Module } from '@nestjs/common';
import { MediaServerService } from './media-server.service';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { MEDIA_SERVER_PROVIDER } from 'shared';
import { ConfigModule } from '../config/config.module';
import { ConfigClientService } from '../config/config.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MEDIA_SERVER_PROVIDER,
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
              queue: allConfig.rabbitMqMediaServerQueue,
              queueOptions: {
                durable: false,
              },
            },
          };
        },
      },
    ]),
  ],
  providers: [MediaServerService],
  controllers: [],
  exports: [MediaServerService],
})
export class MediaServerModule {}
