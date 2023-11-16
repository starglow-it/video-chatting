import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, catchError, map } from 'rxjs';
import { ResponseSumType } from 'shared-types';
import { Socket } from 'socket.io';
import { WsValidationException } from 'src/exceptions/ws-validation.expcetion';
import { WsBadRequestException } from 'src/exceptions/ws.exception';
import { WS_EVENT } from '../utils/decorators/wsEvent.decorator';

@Injectable()
export class WsInterceptor implements NestInterceptor {
  constructor(private readonly reflect: Reflector) {}
  private logger = new Logger(WsInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler<ResponseSumType<any>>): Observable<ResponseSumType<any>> {
    const client = context.switchToWs().getClient() as Socket;
    const eventName = this.reflect.getAllAndOverride<string>(WS_EVENT, [
      context.getHandler(),
    ]);
    const payload = context.switchToWs().getData();
    this.logger.debug({
      clientId: client.id,
      payload,
      eventName,
    });
    console.time(eventName);
    return next.handle().pipe(
      map((data) => {
        console.timeEnd(eventName);
        if (client.data['error']) {
          client.data['error'] = undefined;
        }
        return data;
      }),
      catchError((error) => {
        if (error instanceof WsValidationException) {
          throw new WsValidationException(error.errors);
        }

        throw new WsBadRequestException(error);
      }),
    );
  }
}
