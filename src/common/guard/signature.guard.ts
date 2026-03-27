import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { config } from '@/config.app';

@Injectable()
export class SignatureGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    if (!req) {
      throw new UnauthorizedException('Request not found in context');
    }

    const signature = req?.headers?.['x-signature'];
    if (!signature) {
      throw new UnauthorizedException('Signature not found');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(signature, {
        secret: config.SINATURE_KEY,
        algorithms: ['HS256'],
        //audience: 'server', // (Token dùng cho ai) phải trùng với cấu hình khi tạo token
        //issuer: 'client', // (Ai phát hành token) phải trùng với cấu hình khi tạo token
        ignoreExpiration: false, // không bỏ qua kiểm tra hết hạn
        //subject: 'signature', // (Chủ thể) phải trùng với cấu hình khi tạo token
      });

      req.signaturePayload = decoded;

      return true;
    } catch (error: any) {
      switch (error.name) {
        case 'TokenExpiredError':
          throw new UnauthorizedException('Signature has expired');// Trường hợp token đã hết hạn

        case 'JsonWebTokenError':
          throw new UnauthorizedException('Invalid signature');// Lỗi này bao gồm cả trường hợp signature bị sửa đổi

        case 'NotBeforeError':
          throw new UnauthorizedException('Signature not active yet');// Trường hợp token có nbf (not before) trong tương lai

        default:
          throw new UnauthorizedException('Signature verification failed');// Lỗi chung cho các trường hợp khác
      }
    }
  }
}
