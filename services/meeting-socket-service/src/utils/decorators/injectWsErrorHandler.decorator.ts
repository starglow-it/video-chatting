import {
  UseFilters,
  UsePipes,
  ValidationPipe,
  applyDecorators,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { WsValidationException } from '../../exceptions/ws-validation.expcetion';
import { WsExceptionsFilter } from '../../filters/ws-exceptions.filter';
import { WsValidationExceptionFilter } from '../../filters/ws-validation-exception.filter';

type MultiDecorators = <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void;

export const InjectWsErrorHandler = (): MultiDecorators =>
  applyDecorators(
    UsePipes(
      new ValidationPipe({
        skipMissingProperties: false,
        forbidUnknownValues: true,
        dismissDefaultMessages: true,
        transform: true,
        disableErrorMessages: true,
        stopAtFirstError: true,
        exceptionFactory: (errors: ValidationError[]) =>
          new WsValidationException(errors),
      }),
    ),
    UseFilters(WsValidationExceptionFilter),
    UseFilters(WsExceptionsFilter),
  );
