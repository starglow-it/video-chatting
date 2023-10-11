import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsValidationException } from 'src/exceptions/ws-validation.expcetion';

@Catch(WsValidationException)
export class WsValidationExceptionFilter implements ExceptionFilter {
  catch(exception: WsValidationException, host: ArgumentsHost): any {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    const formattedError = this.formatErrors(exception.errors);

    client.send({
      timestamp: new Date().getTime(),
      error: {
        message: formattedError[0],
      },
    });

    console.log({
      timestamp: new Date().getTime(),
      error: {
        message: formattedError[0],
      },
    });
  }

  formatErrors = (errors: any) => {
    return errors.map((error) => {
      return Object.values(error.constraints).join(', ');
    });
  };
}
