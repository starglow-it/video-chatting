import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Socket } from 'socket.io';
import { WsValidationException } from 'src/exceptions/ws-validation.expcetion';

@Catch(WsValidationException)
export class WsValidationExceptionFilter implements ExceptionFilter {
  private formatErrors = (errors: ValidationError[]) =>
    errors.map((error) => Object.values(error.constraints).join(', '));

  catch(exception: WsValidationException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();
    const data = ctx.getData();

    const formattedError = this.formatErrors(exception.errors);

    console.error({
      clientId: client.id,
      ctx: data,
      error: {
        message: formattedError[0] || 'Invalid data',
      },
    });

    return {
      clientId: client.id,
      ctx: data,
      error: {
        message: formattedError[0] || 'Invalid data',
      },
    };
  }
}
