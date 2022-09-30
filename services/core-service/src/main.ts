import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// modules
import { AppModule } from './app.module';

// interfaces
import { IConfig } from '@shared/interfaces/config.interface';

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
  seeder.createCounter();

  usersController.startCheckSubscriptions();

  return app.listen();
}

bootstrap().then(() => {
  console.log('Core Microservice is listening');
});
