import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// modules
import { AppModule } from './app.module';

// interfaces
import { IConfig } from 'shared-types';

// service
import { ConfigClientService } from './services/config/config.service';
import { SeederService } from './seeder/seeder.service';

// controllers
import { UsersController } from './modules/users/users.controller';

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
          `amqp://${config.rabbitMqUser}:${config.rabbitMqPass}@${config.rabbitMqCoreHost}:${config.rabbitMqCorePort}`,
        ],
        queue: config.rabbitMqCoreQueue,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();

  await seeder.seedBusinessCategories();
  await seeder.seedLanguages();
  await seeder.createCounter();
  await seeder.seedCommonTemplates();
  await seeder.seedAdminUser();

  usersController.startCheckSubscriptions();
  return;
}

bootstrap().then(() => {
  console.log('Core Microservice is listening');
});
