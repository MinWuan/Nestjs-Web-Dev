import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  NotFoundException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RestAppException } from './RestAppException';
import { AppLogger } from '@/common/logger/app.logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new AppLogger();

  constructor() {
    this.logger.setPrefix(AllExceptionsFilter.name);
  }

  catch(exception: any, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      // Để GQL hoặc RPC tự xử lý thông qua return exception
      return exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Lỗi hệ thống nội bộ';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let details: any = null;

    if (exception instanceof RestAppException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      errorCode = exceptionResponse.errorCode || errorCode;
      message = exceptionResponse.message || message;
      details = exceptionResponse.details;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && Array.isArray(exceptionResponse.message)) {
        // Xử lý lỗi validation từ ValidationPipe (class-validator)
        errorCode = 'VALIDATION_ERROR';
        message = 'Dữ liệu đầu vào không hợp lệ';
        details = exceptionResponse.message;
        //console.log('exceptionResponse', exceptionResponse);
      } else if (typeof exceptionResponse === 'object') {
        errorCode = exceptionResponse.error || `HTTP_ERROR_${status}`;
        message = exceptionResponse.message || exception.message;
      } else {
        errorCode = `HTTP_ERROR_${status}`;
        message = exceptionResponse || exception.message;
      }
    } else if (exception instanceof Error) {
      // Bắt các lỗi hệ thống không lường trước (DB, unhandled promise...)
      message = process.env.NODE_ENV === 'production' ? 'Đã xảy ra lỗi không xác định trên máy chủ' : exception.message;
    }

    // Logging lỗi
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      // this.logger.error(
      //   `[${request.method}] ${request.url} - ${exception instanceof Error ? exception.message : message}`,
      //   exception instanceof Error ? exception.stack : ''
      // );
      this.logger.error({
         message: `🌐 ➤ 🔴 [${request.method}] ${request.url} - ${exception instanceof Error ? exception.message : message}`,
         trace: exception instanceof Error ? exception.stack : '',
      })
    } else {
      this.logger.warn(`🌐 ➤ 🟡 [${request.method}] ${request.url} - ${message}`);
    }

    // Format response chung cho toàn bộ REST API
    const errorResponse = {
      errorCode,
      message,
      ...(details && { details }),
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      return exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(HttpStatus.NOT_FOUND).json({
      errorCode: 'NOT_FOUND',
      message: `🔍 Không tìm thấy đường dẫn: ${request.method} ${request.url}`,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

