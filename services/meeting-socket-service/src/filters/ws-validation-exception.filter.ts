import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Socket } from 'socket.io';
import { WsValidationException } from '../exceptions/ws-validation.expcetion';

@Catch(WsValidationException)
export class WsValidationExceptionFilter implements ExceptionFilter {
  private errs = [];
  private formatErrors = (errors: ValidationError[]) => {
    const r = errors.map((error) => {
      if (error.children.length) return this.formatErrors(error.children);
      return `${error.property} ${
        Object.values(error.constraints).join(', ') || 'invalid'
      }`;
    });

    if (!this.errs.length) {
      this.errs = r;
    }

    return this.errs;
  };

  catch(exception: WsValidationException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();
    const data = ctx.getData();

    this.formatErrors(exception.errors);

    console.error({
      clientId: client.id,
      ctx: data,
      error: {
        message: this.errs[0] || 'Invalid data',
      },
    });

    return {
      clientId: client.id,
      ctx: data,
      error: {
        message: this.errs[0] || 'Invalid data',
      },
    };
  }
}
