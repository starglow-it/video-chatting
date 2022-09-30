import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from '../exceptions/validation.exception';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const formattedError = this.formatErrors(exception.errors);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().getTime(),
      errorCode: response?.['errorCode'],
      errorJsonObject: (response as any).error,
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
