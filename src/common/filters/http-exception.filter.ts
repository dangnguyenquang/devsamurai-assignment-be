import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';
import { ResponseUtil } from '../utils/response.util';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    let apiResponse: ApiResponse;

    if (status === HttpStatus.UNPROCESSABLE_ENTITY || status === HttpStatus.BAD_REQUEST) {
      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        const errors: Record<string, string[]> = {};
        
        if (Array.isArray(exceptionResponse['message'])) {
          exceptionResponse['message'].forEach((error: string) => {
            const field = error.split(' ')[0] || 'general';
            if (!errors[field]) {
              errors[field] = [];
            }
            errors[field].push(error);
          });
        }
        
        apiResponse = ResponseUtil.validationError(errors);
      } else {
        apiResponse = ResponseUtil.error(exception.message, status);
      }
    } else {
      const message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : exceptionResponse['message'] || exception.message;
        
      apiResponse = ResponseUtil.error(message, status);
    }

    response.status(status).json(apiResponse);
  }
}