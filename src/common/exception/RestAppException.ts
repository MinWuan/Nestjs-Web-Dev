import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@/common/constants/common';

export { ErrorCode };

type RestAppExceptionOptions = {
  message?: string;
  errorCode?: ErrorCode | string;
  statusCode?: HttpStatus;
  details?: Record<string, any> | any[];
};

export class RestAppException extends HttpException {
  public readonly errorCode: string;
  public readonly details?: Record<string, any> | any[];

  /**
   * Khởi tạo một Custom Exception cho Rest API
   * @param options Các tham số đầu vào dạng JSON:
   *   - message: Lời nhắn lỗi (Human readable) (Mặc định: 'Bad Request')
   *   - errorCode: Mã lỗi ứng dụng (VD: USER_NOT_FOUND, INVALID_PARAMS) (Mặc định: 'BAD_REQUEST')
   *   - status: Mã HTTP Status (Mặc định: 400 Bad Request)
   *   - details: Chi tiết lỗi bổ sung (Dùng cho validation, array errors...)
   */
  constructor({
    message = 'Bad Request',
    errorCode = ErrorCode.BAD_REQUEST,
    statusCode = HttpStatus.BAD_REQUEST,
    details,
  }: RestAppExceptionOptions = {}) {
    super(
      {
        success: false,
        errorCode,
        message,
        details,
      },
      statusCode,
    );
    this.errorCode = errorCode as string;
    this.details = details;
  }

  // --- Các Helper Methods tạo Exception phổ biến ---

  static BadRequest({
    message = 'Bad Request',
    errorCode = ErrorCode.BAD_REQUEST,
    details,
  }: {
    message?: string;
    errorCode?: string;
    details?: Record<string, any> | any[];
  } = {}) {
    return new RestAppException({ message, errorCode, statusCode: HttpStatus.BAD_REQUEST, details });
  }

  static NotFound({
    message = 'Not Found',
    errorCode = ErrorCode.NOT_FOUND,
    details,
  }: {
    message?: string;
    errorCode?: string;
    details?: Record<string, any> | any[];
  } = {}) {
    return new RestAppException({ message, errorCode, statusCode: HttpStatus.NOT_FOUND, details });
  }

  static Unauthorized({
    message = 'Unauthorized',
    errorCode = ErrorCode.UNAUTHORIZED,
    details,
  }: {
    message?: string;
    errorCode?: string;
    details?: Record<string, any> | any[];
  } = {}) {
    return new RestAppException({ message, errorCode, statusCode: HttpStatus.UNAUTHORIZED, details });
  }

  static Forbidden({
    message = 'Forbidden',
    errorCode = ErrorCode.FORBIDDEN,
    details,
  }: {
    message?: string;
    errorCode?: string;
    details?: Record<string, any> | any[];
  } = {}) {
    return new RestAppException({ message, errorCode, statusCode: HttpStatus.FORBIDDEN, details });
  }

  static Conflict({
    message = 'Conflict',
    errorCode = ErrorCode.CONFLICT,
    details,
  }: {
    message?: string;
    errorCode?: string;
    details?: Record<string, any> | any[];
  } = {}) {
    return new RestAppException({ message, errorCode, statusCode: HttpStatus.CONFLICT, details });
  }

  static InternalServerError({
    message = 'Internal Server Error',
    errorCode = ErrorCode.INTERNAL_ERROR,
    details,
  }: {
    message?: string;
    errorCode?: string;
    details?: Record<string, any> | any[];
  } = {}) {
    return new RestAppException({
      message,
      errorCode,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    });
  }
}
