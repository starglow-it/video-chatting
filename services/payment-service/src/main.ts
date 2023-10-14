import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { IConfig } from 'shared-types';

import { AppModule } from './app.module';
import { ConfigClientService } from './services/config/config.service';
import { PaymentsController } from './modules/payments/payments.controller';
import { PaymentsModule } from './modules/payments/payments.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigClientService);
  const config: IConfig = await configService.getAll();

  app.use('/payments/webhook', express.raw({ type: 'application/json' }));
  app.use(
    '/payments/express-webhook',
    express.raw({ type: 'application/json' }),
  );

  const paymentMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(PaymentsModule, {
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
    });

  const paymentsController = paymentMicroservice.get(PaymentsController);

  await paymentMicroservice.listen();

  app.connectMicroservice(paymentMicroservice);

  await paymentsController.createSubscriptionsIfNotExists();

  await app.listen(5000);
}

bootstrap();

process.on('uncaughtException', (err) => console.log(err));
process.on('unhandledRejection', (reason) => console.log(reason));
