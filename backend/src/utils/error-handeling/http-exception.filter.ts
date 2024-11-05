import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { logEvents } from './log-error.handeler.middleware';
import { AppError } from './app.error';
import { ResponseDataModel } from 'src/common/models/response.model';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: HttpException | AppError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : (exception as AppError).statusCode || 500;

    const logMessage = `${exception.name}: ${exception.message}\t${request.method}\t${request.url}\t${request.headers.origin || 'unknown origin'}`;
    await logEvents(logMessage, 'errLog.log');

    const errorResponse: ResponseDataModel<null> = {
      ResponseCode: status,
      ResponseData: null,
      ResponseMessage: exception.message,
    };

    response.status(status).json(errorResponse);
  }
}