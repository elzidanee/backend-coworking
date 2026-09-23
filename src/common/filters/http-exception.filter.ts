import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    const message = typeof exceptionResponse === 'string'
      ? exceptionResponse
      : exceptionResponse.message || exception.message;

    response.status(status).json({
      status: false,
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message, // class-validator bisa balikin array error
      error: HttpStatus[status] || 'Error',
      timestamp: new Date().toISOString(),
    });
  }
}