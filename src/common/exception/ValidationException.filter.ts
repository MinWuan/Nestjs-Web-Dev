import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { RestAppException } from '@/common/exception/RestAppException';
import { AppLogger } from '@/common/logger/app.logger';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new AppLogger();
  constructor() {
    this.logger.setPrefix(ValidationExceptionFilter.name);
  }
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const response = exception.getResponse() as any;

    // Kiểm tra xem request hiện tại là GraphQL hay REST
    if (host.getType<GqlContextType>() === 'graphql') {
      // TRẢ VỀ ĐỊNH DẠNG GRAPHQL
      return new GraphQLError(`GraphQL: ${response.message}`, {
        extensions: {
          code: response.code,
          details: response.rawErrors,
        },
      });
    }

    // TRẢ VỀ CHO REST API
    const ctx = host.switchToHttp();
    const httpResponse = ctx.getResponse();
    const request = ctx.getRequest();

    this.logger.error({
      message: `🌐 ➤ 🔴 [${request.method}] ${request.url} - ${exception instanceof Error ? exception.message : response.message}`,
      meta: {
        details: response?.formattedErrors,
      },
      trace: exception instanceof Error ? exception.stack : '',
    });

    // Dùng đúng Format RestAppException của bạn
    return httpResponse.status(400).json({
      errorCode: response.code,
      message: `REST: ${response.message}`,
      details: response?.formattedErrors
        ? response?.formattedErrors
        : undefined,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
