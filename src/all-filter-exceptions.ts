import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response, Request } from 'express';
import { DatabaseError } from 'pg';
import { LoggerService } from './logger/logger.service';

type ResponseObj = {
  timestamp: string;
  path: string;
  statusCode: number;
  response?: {
    message: string;
  };
  detail?: {
    name?: string;
    stack?: object | string | null;
  };
};

@Catch()
export class AllFilterExceptions extends BaseExceptionFilter {
  private readonly logger = new LoggerService(AllFilterExceptions.name);
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseObj: ResponseObj = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: { message: 'Internal server error' },
    };

    if (exception instanceof HttpException) {
      const excResponse = exception.getResponse();
      responseObj.response = {
        message: typeof excResponse === 'string' ? excResponse : 'Http error',
      };
      responseObj.detail = {
        name: exception.constructor.name,
        ...(typeof excResponse === 'object' ? excResponse : null),
      };
      responseObj.statusCode = exception.getStatus();
    } else if (exception instanceof DatabaseError) {
      responseObj.statusCode = 422;
      responseObj.response = {
        message: exception.message,
      };
    } else if (exception instanceof Error) {
      responseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseObj.statusCode = 500;
      responseObj.detail = { stack: exception.stack };
      responseObj.response = { message: exception.message };
    }

    response.status(responseObj.statusCode).json(responseObj);
    this.logger.errorWithPayload('Error occured', {
      ...responseObj,
      exception: exception instanceof Error ? exception.stack : exception,
    });
  }
}
