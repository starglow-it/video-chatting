import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { IConfig, TimeoutTypesEnum } from 'shared-types';

import { AppModule } from './app.module';
import { ConfigClientService } from './services/config/config.service';
import { TasksService } from './modules/tasks/tasks.service';
import { ScalingService } from './modules/scaling/scaling.service';
import { getTimeoutTimestamp } from './utils/getTimeoutTimestamp';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigClientService);
  const tasksService = appContext.get(TasksService);
  const scalingService = appContext.get(ScalingService);

  const config: IConfig = await configService.getAll();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${config.rabbitMqUser}:${config.rabbitMqPass}@${config.rabbitMqHost}`,
        ],
        queue: config.rabbitMqScalingQueue,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();

  if (config.supportScaling) {
    await scalingService.terminateOldSnapshotInstances();
    await scalingService.checkNumberOfVacantServers();
    scalingService.terminateStoppedInstances();

    tasksService.addInterval({
      name: 'terminateInstances',
      ts: getTimeoutTimestamp({ value: 3, type: TimeoutTypesEnum.Minutes }),
      callback: scalingService.terminateStoppedInstances.bind(scalingService),
    });

    tasksService.addInterval({
      name: 'checkNumberOfVacantServers',
      ts: getTimeoutTimestamp({ value: 3, type: TimeoutTypesEnum.Minutes }),
      callback: scalingService.checkNumberOfVacantServers.bind(scalingService),
    });
  }
}

bootstrap();
