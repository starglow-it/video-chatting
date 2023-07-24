import { Module } from '@nestjs/common';
import {
  Transport,
  ClientsModule,
  ClientProvider,
} from '@nestjs/microservices';

import { NOTIFICATIONS_PROVIDER } from 'shared-const';

// modules
import { ConfigModule } from '../config/config.module';

// services
import { ConfigClientService } from '../config/config.service';
import { NotificationsService } from './notifications.service';
import { MonitoringModule } from 'src/modules/monitoring/monitoring.module';

@Module({
  imports: [
    MonitoringModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_PROVIDER,
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
              queue: allConfig.rabbitMqNotificationsQueue,
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
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
