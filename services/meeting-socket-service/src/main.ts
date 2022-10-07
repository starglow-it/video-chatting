import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { ValidationError } from 'class-validator';

import { AppModule } from './app.module';

import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';
import { ValidationException } from './exceptions/validation.exception';
import { ConfigClientService } from './services/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigClientService);
  const frontendUrl = await configService.get('frontendUrl');

  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new ValidationExceptionFilter(),
  );

  app.enableCors({
    origin: frontendUrl,
  });

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

  await app.listen(8180);
}
bootstrap();
