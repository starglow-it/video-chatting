import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WsExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as Socket;
    const error =
      exception instanceof WsException
        ? exception.getError()
        : exception.getResponse();
    const data = host.switchToWs().getData();
    const details = error instanceof Object ? { ...error } : { message: error };
    console.error({
      clientId: client.id,
      ctx: data,
      error: details,
    });
    return {
      success: false,
    };
  }
}
