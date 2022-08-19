import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { IConfig } from '@shared/interfaces/config.interface';

import { AppModule } from './app.module';
import { ConfigClientService } from './config/config.service';
import { PaymentsController } from './payments/payments.controller';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigClientService);
  const paymentsController = appContext.get(PaymentsController);
  const config: IConfig = await configService.getAll();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${config.rabbitMqUser}:${config.rabbitMqPass}@${config.rabbitMqHost}`,
        ],
        queue: config.rabbitMqPaymentQueue,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await paymentsController.createSubscriptionsIfNotExists();

  await app.listen();
}
bootstrap();
