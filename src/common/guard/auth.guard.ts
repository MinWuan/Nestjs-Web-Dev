import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
// import { JwtService } from '@nestjs/jwt'; // Nếu bạn dùng JWT

@Injectable()
export class AuthGuard implements CanActivate {
  // constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Chuyển đổi Context sang GraphQL Context
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    // Lưu ý: Với Subscription, 'req' có thể không tồn tại trực tiếp mà nằm trong connection
    // Nếu bạn làm Subscription, cần handle thêm phần lấy token từ connectionParams

    // 2. Lấy token từ Header
    const authHeader = req?.headers?.authorization; // "Bearer eyJhb..."

    if (!authHeader) {
      throw new UnauthorizedException('Token not found');
    }

    const token = authHeader.split(' ')[1]; // Lấy phần token sau chữ Bearer
    console.log('AuthGuard Token:', token);
    if (!token) {
      throw new UnauthorizedException('Token format invalid');
    }

    try {
      // 3. Verify Token (Giả lập logic check token)
      // const payload = this.jwtService.verify(token);

      // Ví dụ fake payload sau khi parse
      const userPayload = {
        userId: '123',
        email: 'test@gmail.com',
        roles: [token],
      };

      // 4. QUAN TRỌNG: Gán user đã parse vào request
      // Để lát nữa Resolver có thể lấy ra dùng
      req['user'] = userPayload;

      return true; // Cho phép đi tiếp
    } catch (error) {
      throw new UnauthorizedException('Token invalid or expired');
    }
  }
}
