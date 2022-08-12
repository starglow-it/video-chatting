import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { IConfig } from '@shared/interfaces/config.interface';
import { ConfigClientService } from './config/config.service';
import { SeederService } from './seeder/seeder.service';
import { UsersController } from './users/users.controller';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigClientService);
  const config: IConfig = await configService.getAll();

  const seeder = appContext.get(SeederService);
  const usersController = appContext.get(UsersController);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${config.rabbitMqUser}:${config.rabbitMqPass}@${config.rabbitMqHost}`,
        ],
        queue: config.rabbitMqCoreQueue,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await seeder.seedBusinessCategories();
  await seeder.seedLanguages();
  await seeder.seedCommonTemplates();

  usersController.startCheckSubscriptions();

  return app.listen();
}

bootstrap().then(() => {
  console.log('Core Microservice is listening');
});
