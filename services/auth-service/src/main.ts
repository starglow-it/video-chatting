import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { IConfig } from 'shared-types';

// modules
import { AppModule } from './app.module';

// services
import { ConfigClientService } from './services/config/config.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigClientService);
  const config: IConfig = await configService.getAll();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${config.rabbitMqUser}:${config.rabbitMqPass}@${config.rabbitMqHost}`,
        ],
        queue: config.rabbitMqAuthQueue,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  return app.listen();
}

bootstrap().then(() => {
  console.log('Auth Microservice is listening');
});
