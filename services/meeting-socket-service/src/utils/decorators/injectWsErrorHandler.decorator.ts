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
import { TMultiDecorators } from '../types/multipleDecorator';

export const InjectWsErrorHandler = (): TMultiDecorators =>
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
    UseFilters(WsValidationExceptionFilter, WsExceptionsFilter),
  );
