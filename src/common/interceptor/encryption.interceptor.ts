import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { encryptJSON, decryptJSON } from '../../shared/utils/crypto.util'; // Import từ helper trên
import { RestAppException } from '@/common/exception/RestAppException';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if ((context.getType() as string) === 'graphql') {
      return next.handle();
    }

    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const res = httpContext.getResponse();

    if (!req) {
      return next.handle();
    }

    const isEncryptedRequest =
      req.headers['x-encrypted-request'] === '1' || req.query['x-erq'] === '1';

    const isEncryptedResponse =
      req.headers['x-encrypted-response'] === '1' || req.query['x-erp'] === '1';

    // 🔓 Handle Request (decrypt)
    if (isEncryptedRequest) {
      const isBodyEmpty = !req.body || Object.keys(req.body).length === 0;

      if (!isBodyEmpty) {
        try {
          req.body = decryptJSON(req.body);
        } catch (err) {
          //logError('DecryptRequest', '❌ Giải mã request thất bại:', err);
          throw new RestAppException({
            errorCode: 'DECRYPTION_FAILED',
            message: 'Dữ liệu đầu vào không hợp lệ',
          });
        }
      }
    }

    // 🔐 Handle Response (encrypt)
    return next.handle().pipe(
      map((data) => {
        if (isEncryptedResponse && data) {
          try {
            const encrypted = encryptJSON(data);

            res.setHeader('x-encrypted-response', '1');
            res.setHeader('Content-Type', 'text/plain');

            return encrypted;
          } catch (err) {
            //logError('EncryptResponse', '❌ Mã hoá response thất bại:', err);
            throw new RestAppException({
              errorCode: 'ENCRYPTION_FAILED',
              message: 'Đã xảy ra lỗi',
            });
          }
        }

        return data;
      }),
    );
  }
}
