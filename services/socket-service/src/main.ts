import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { ValidationError } from 'class-validator';

import { AppModule } from './app.module';

import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';
import { ValidationException } from './exceptions/validation.exception';
import { IConfig } from 'shared';
import { ConfigClientService } from './services/config/config.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigClientService);
  const config: IConfig = await configService.getAll();

  const socketMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${config.rabbitMqUser}:${config.rabbitMqPass}@${config.rabbitMqHost}`,
        ],
        queue: config.rabbitMqSocketQueue,
        queueOptions: {
          durable: false,
        },
      },
    });

  await socketMicroservice.listen();

  app.connectMicroservice(socketMicroservice);

  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new ValidationExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      forbidUnknownValues: true,
      dismissDefaultMessages: true,
      transform: true,
      disableErrorMessages: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new ValidationException(errors),
    }),
  );

  await app.listen(8080);
}
bootstrap();
