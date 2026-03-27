import { GraphQLError } from 'graphql';
import { ErrorCode } from '@/common/constants/common';
// Định nghĩa các Code lỗi chuẩn của dự án để tránh hardcode string lung tung

type GqlAppExceptionOptions = {
  message?: string;
  errorCode?: ErrorCode | string;
  statusCode?: number;
  details?: any;
};

export class GqlAppException extends GraphQLError {
  constructor({
    message = 'Internal Server Error',
    errorCode = ErrorCode.INTERNAL_ERROR,
    statusCode = 500,
    details,
  }: GqlAppExceptionOptions = {}) {
    super(message, {
      extensions: {
        errorCode, // Code logic (USER_NOT_FOUND)
        statusCode, // HTTP Status (404)
        details, // Object chi tiết lỗi (nếu cần)
        timestamp: new Date().toISOString(),
      },
    });
  }

  // --- CÁC HÀM STATIC TIỆN ÍCH (HELPER METHODS) ---
  // Sử dụng: throw GqlAppException.BadRequest({ message: 'Email không đúng định dạng' })
  static BadRequest({
    message,
    errorCode = ErrorCode.BAD_REQUEST,
    details,
  }: {
    message: string;
    errorCode?: string;
    details?: any;
  }) {
    return new GqlAppException({ message, errorCode, statusCode: 400, details });
  }

  // Sử dụng: throw GqlAppException.NotFound({ message: 'Không tìm thấy User' })
  static NotFound({
    message,
    errorCode = ErrorCode.NOT_FOUND,
    details,
  }: {
    message: string;
    errorCode?: string;
    details?: any;
  }) {
    return new GqlAppException({ message, errorCode, statusCode: 404, details });
  }

  // Sử dụng: throw GqlAppException.Unauthorized({ message: 'Vui lòng đăng nhập' })
  static Unauthorized({
    message = 'Unauthorized',
    errorCode = ErrorCode.UNAUTHORIZED,
    details,
  }: { message?: string; errorCode?: string; details?: any } = {}) {
    return new GqlAppException({ message, errorCode, statusCode: 401, details });
  }

  // Sử dụng: throw GqlAppException.Forbidden({ message: 'Bạn không có quyền admin' })
  static Forbidden({
    message = 'Forbidden',
    errorCode = ErrorCode.FORBIDDEN,
    details,
  }: { message?: string; errorCode?: string; details?: any } = {}) {
    return new GqlAppException({ message, errorCode, statusCode: 403, details });
  }

  // Sử dụng: throw GqlAppException.Conflict({ message: 'Email này đã được sử dụng' })
  static Conflict({
    message,
    errorCode = ErrorCode.CONFLICT,
    details,
  }: {
    message: string;
    errorCode?: string;
    details?: any;
  }) {
    return new GqlAppException({ message, errorCode, statusCode: 409, details });
  }

  // Sử dụng: throw GqlAppException.InternalError({ message: 'Lỗi kết nối DB' })
  static InternalServerError({
    message = 'Internal Server Error',
    errorCode = ErrorCode.INTERNAL_ERROR,
    details,
  }: { message?: string; errorCode?: string; details?: any } = {}) {
    return new GqlAppException({
      message,
      errorCode: ErrorCode.INTERNAL_ERROR,
      statusCode: 500,
      details,
    });
  }

  /**
   * Ném lỗi liên quan đến cơ sở dữ liệu (Database Error), cho phép custom code, statusCode, message, details
   * @param message Thông báo lỗi (mặc định: 'Database Error')
   * @param code Mã lỗi logic (mặc định: 'DATABASE_ERROR')
   * @param statusCode HTTP status code (mặc định: 500)
   * @param details Thông tin chi tiết lỗi (nếu có)
   * @returns GqlAppException với các trường đã custom
   *
   * Ví dụ sử dụng:
   *   throw GqlAppException.DatabaseError({ message: 'Lỗi DB', code: 'DB_CONN_FAIL', statusCode: 503, details: error })
   */
  static DatabaseError({
    message = 'Database Error',
    errorCode = 'DATABASE_ERROR',
    statusCode = 500,
    details,
  }: {
    message?: string;
    errorCode?: string;
    statusCode?: number;
    details?: any;
  } = {}) {
    return new GqlAppException({ message, errorCode, statusCode, details });
  }
}
