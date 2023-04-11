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
import { MonetizationStatisticController } from './modules/monetization-statistic/monetization-statistic.controller';
import { DashboardNotificationsController } from './modules/dashboard-notifications/dashboard-notifications.controller';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigClientService);
  const config: IConfig = await configService.getAll();

  const seeder = appContext.get(SeederService);
  const usersController = appContext.get(UsersController);
  const dashboardNotificationsController = appContext.get(
    DashboardNotificationsController,
  );
  const monetizationController = appContext.get(
    MonetizationStatisticController,
  );

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          config.environment == 'local'
            ? `amqp://${config.rabbitMqUser}:${config.rabbitMqPass}@${config.rabbitMqHost}`
            : `amqp://${config.rabbitMqUser}:${config.rabbitMqPass}@${config.rabbitMqCoreHost}:${config.rabbitMqCorePort}`,
        ],
        queue: config.rabbitMqCoreQueue,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();

  // await seeder.uploadEmoji();
  await seeder.seedBusinessCategories();
  await seeder.seedLanguages();
  await seeder.createCounter();
  await seeder.seedAdminUser();
  await seeder.seedMonetizationStatistic();
  await seeder.seedRoomStatistic();
  await seeder.seedLinks();
  await seeder.seedCreateGlobalCommonTemplate();
  await seeder.seedMedias();

  usersController.startCheckSubscriptions();
  monetizationController.startCheckLastMonthMonetization();
  dashboardNotificationsController.deleteDashboardNotifications();
  
  return;
}

process.on('uncaughtException', (err, origin) => console.log(origin));

process.on('unhandledRejection', (reason) => console.log(reason));

bootstrap().then(() => {
  console.log('Core Microservice is listening');
});
