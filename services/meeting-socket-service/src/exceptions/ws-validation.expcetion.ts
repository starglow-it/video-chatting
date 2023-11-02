import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { ValidationError } from 'class-validator';

export class WsValidationException extends WsException {
  constructor(public errors: ValidationError[]) {
    super(errors);
  }
}
