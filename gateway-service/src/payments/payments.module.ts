import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

import { PAYMENTS_PROVIDER } from '@shared/providers';
import { JWT_ACCESS_EXPIRE } from '@shared/const/jwt.const';

import { PaymentsController } from './payments.controller';

import { PaymentsService } from './payments.service';
import { ConfigClientService } from '../config/config.service';

import { CoreModule } from '../core/core.module';
import { TemplatesModule } from '../templates/templates.module';

@Module({
  imports: [
    CoreModule,
    TemplatesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigClientService],
      useFactory: async (config: ConfigClientService) => ({
        secret: await config.get('jwtSecret'),
        signOptions: { expiresIn: JWT_ACCESS_EXPIRE },
      }),
    }),
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
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
