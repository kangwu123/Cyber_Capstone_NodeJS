import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse: any = exception.getResponse();

    const message = typeof exceptionResponse === 'object'
      ? exceptionResponse.message
      : exceptionResponse;

    response.status(status).json({
      status: 'fail',
      statusCode: status,
      message: message,
      error: exception.name
    });
  }
}