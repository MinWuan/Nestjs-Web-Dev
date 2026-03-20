import { HttpException, HttpStatus } from '@nestjs/common';

export class RestAppException extends HttpException {
  public readonly errorCode: string;
  public readonly details?: Record<string, any> | any[];

  /**
   * Khởi tạo một Custom Exception cho Rest API
   * @param message Lời nhắn lỗi (Human readable)
   * @param errorCode Mã lỗi ứng dụng (VD: USER_NOT_FOUND, INVALID_PARAMS)
   * @param status Mã HTTP Status (Mặc định: 400 Bad Request)
   * @param details Chi tiết lỗi bổ sung (Dùng cho validation, array errors...)
   */
  constructor(
    message: string,
    errorCode: string = 'BAD_REQUEST',
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: Record<string, any> | any[],
  ) {
    super(
      {
        success: false,
        errorCode,
        message,
        details,
      },
      status,
    );
    this.errorCode = errorCode;
    this.details = details;
  }

  // --- Các Helper Methods tạo Exception phổ biến ---

  static BadRequest(message: string, errorCode: string = 'BAD_REQUEST', details?: any) {
    return new RestAppException(message, errorCode, HttpStatus.BAD_REQUEST, details);
  }

  static NotFound(message: string, errorCode: string = 'NOT_FOUND', details?: any) {
    return new RestAppException(message, errorCode, HttpStatus.NOT_FOUND, details);
  }

  static Unauthorized(message: string, errorCode: string = 'UNAUTHORIZED', details?: any) {
    return new RestAppException(message, errorCode, HttpStatus.UNAUTHORIZED, details);
  }

  static Forbidden(message: string, errorCode: string = 'FORBIDDEN', details?: any) {
    return new RestAppException(message, errorCode, HttpStatus.FORBIDDEN, details);
  }

  static Conflict(message: string, errorCode: string = 'CONFLICT', details?: any) {
    return new RestAppException(message, errorCode, HttpStatus.CONFLICT, details);
  }

  static InternalError(message: string, errorCode: string = 'INTERNAL_ERROR', details?: any) {
    return new RestAppException(message, errorCode, HttpStatus.INTERNAL_SERVER_ERROR, details);
  }
}
