import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import * as express from 'express';

// modules
import { AppModule } from './app.module';

// exceptions
import { ValidationException } from './exceptions/validation.exception';

// filters
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';

// interceptors
import { LoggerInterceptor } from './interceptors/logger.interceptor';

// shared
import { ROOT_SCOPE } from 'shared-const';
import { IConfig } from 'shared-types';
import { ConfigClientService } from './services/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigClientService);
  const config: IConfig = await configService.getAll();

  app.setGlobalPrefix(ROOT_SCOPE);

  // Swagger setup
  const options = new DocumentBuilder()
    .setTitle('Chatruume')
    .setDescription('Chatruume gateway api')
    .setVersion(config.apiVersion)
    .addTag('chatruume')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`${ROOT_SCOPE}swagger`, app, document);

  app.use('/maindrill', express.raw({ type: 'application/json' }));

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

  app.useGlobalInterceptors(new LoggerInterceptor());

  app.use(cookieParser());

  await app.listen(config.gatewayPort);
}

process.on('uncaughtException', (err, origin) => console.log(origin));

process.on('unhandledRejection', (reason) => console.log(reason));

bootstrap().then(() => {
  console.log('Gateway Server is Ready');
});
