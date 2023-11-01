import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `Request: [${request.method}] ${request.path} | Response: ${
              response.statusCode
            } ${Date.now() - now}ms`,
            context.getClass().name,
          ),
        ),
      );
  }
}
