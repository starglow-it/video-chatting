import {Global, Module} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

import { JWT_ACCESS_EXPIRE, PAYMENTS_PROVIDER } from 'shared-const';

// controllers
import { PaymentsController } from './payments.controller';

// services
import { PaymentsService } from './payments.service';
import { ConfigClientService } from '../../services/config/config.service';

// nodules
import { ConfigModule } from '../../services/config/config.module';

@Global()
@Module({
  imports: [
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
