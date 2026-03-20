import { GraphQLError } from 'graphql';

// Định nghĩa các Code lỗi chuẩn của dự án để tránh hardcode string lung tung
export enum ErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT = 'CONFLICT', // Ví dụ: Email đã tồn tại
}

type GqlAppExceptionOptions = {
  message?: string;
  code?: ErrorCode | string;
  statusCode?: number;
  details?: any;
};

export class GqlAppException extends GraphQLError {
  constructor({
    message = 'Internal Server Error',
    code = ErrorCode.INTERNAL_ERROR,
    statusCode = 500,
    details,
  }: GqlAppExceptionOptions = {}) {
    super(message, {
      extensions: {
        code, // Code logic (USER_NOT_FOUND)
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
    code = ErrorCode.BAD_REQUEST,
    details,
  }: {
    message: string;
    code?: string;
    details?: any;
  }) {
    return new GqlAppException({ message, code, statusCode: 400, details });
  }

  // Sử dụng: throw GqlAppException.NotFound({ message: 'Không tìm thấy User' })
  static NotFound({
    message,
    code = ErrorCode.NOT_FOUND,
  }: {
    message: string;
    code?: string;
  }) {
    return new GqlAppException({ message, code, statusCode: 404 });
  }

  // Sử dụng: throw GqlAppException.Unauthorized({ message: 'Vui lòng đăng nhập' })
  static Unauthorized({
    message = 'Unauthorized',
    code = ErrorCode.UNAUTHORIZED,
  }: { message?: string; code?: string } = {}) {
    return new GqlAppException({ message, code, statusCode: 401 });
  }

  // Sử dụng: throw GqlAppException.Forbidden({ message: 'Bạn không có quyền admin' })
  static Forbidden({
    message = 'Forbidden',
    code = ErrorCode.FORBIDDEN,
  }: { message?: string; code?: string } = {}) {
    return new GqlAppException({ message, code, statusCode: 403 });
  }

  // Sử dụng: throw GqlAppException.Conflict({ message: 'Email này đã được sử dụng' })
  static Conflict({
    message,
    code = ErrorCode.CONFLICT,
  }: {
    message: string;
    code?: string;
  }) {
    return new GqlAppException({ message, code, statusCode: 409 });
  }

  // Sử dụng: throw GqlAppException.InternalError({ message: 'Lỗi kết nối DB' })
  static InternalError({
    message = 'Internal Server Error',
    details,
  }: { message?: string; details?: any } = {}) {
    return new GqlAppException({
      message,
      code: ErrorCode.INTERNAL_ERROR,
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
    code = 'DATABASE_ERROR',
    statusCode = 500,
    details,
  }: {
    message?: string;
    code?: string;
    statusCode?: number;
    details?: any;
  } = {}) {
    return new GqlAppException({ message, code, statusCode, details });
  }
}
