import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { EMPTY, Observable, catchError, map, throwError } from 'rxjs';
import { ResponseSumType } from 'shared-types';
import { Socket } from 'socket.io';
import { WsValidationException } from 'src/exceptions/ws-validation.expcetion';
import { WsBadRequestException } from 'src/exceptions/ws.exception';

@Injectable()
export class WsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const client = context.switchToWs().getClient() as Socket;
    return next.handle().pipe(
      map((data) => {
        client.send(data);
        return;
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
