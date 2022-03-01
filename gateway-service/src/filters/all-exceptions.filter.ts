import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const isHttpException: boolean = exception instanceof HttpException;

    let status;
    let body;
    if (isHttpException) {
      status = (exception as HttpException).getStatus();
      const response = (exception as HttpException).getResponse();

      body = {
        statusCode: status,
        error: {
          message: response?.['message'],
          errorCode: response?.['errorCode'],
          errorJsonObject: (response as any).error,
        },
      };
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      body = {
        statusCode: 500,
        error: 'Internal server error',
      };
    }

    this.logger.error(
      `Error on request: [${request.method}] ${request.path} | Response status: ${status}`,
    );
    if (!isHttpException) {
      exception && this.logger.error((exception as Error).stack);
    }
    response.status(status).json(body);
  }
}
