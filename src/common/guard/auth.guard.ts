import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { config } from '@/config.app';
import { keyJWT, PayloadSession } from '@/common/constants/common';
import { SessionRepositoryFacade } from '@/modules/session';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private sessionRepositoryFacade: SessionRepositoryFacade,
    private clsService: ClsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Chuyển đổi Context sang GraphQL Context
  
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext();

      // Lưu ý: Với Subscription, 'req' có thể không tồn tại trực tiếp mà nằm trong connection
      // Nếu bạn làm Subscription, cần handle thêm phần lấy token từ connectionParams

      // 2. Lấy token từ Header
      const token = req?.headers?.['authorization']?.replace('Bearer ', '');

      if (!token) {
        throw new UnauthorizedException('Token not found');
      }

      const decodedToken: PayloadSession = await this.jwtService
        .verifyAsync(token, {
          secret: config.JWT_KEY_AUTH,
          algorithms: ['HS256'],
          audience: 'server',
          issuer: 'client',
          subject: keyJWT.SESSION,
        })
        .catch((error) => {
          throw new UnauthorizedException('Token not valid');
        });

      if (!decodedToken?.session_id) {
        throw new UnauthorizedException('Token not session');
      }

      const session =
        await this.sessionRepositoryFacade.getSessionWithUserAndRole(
          decodedToken?.session_id,
        );
      //console.log('session', session);

      if (!session) {
        throw new UnauthorizedException('Session not found');
      }

      const authPayload: AuthPayload = {
        user: session?.user,
        role: session?.user?.role,
      };
      // 4. QUAN TRỌNG: Gán user đã parse vào request
      // Để lát nữa Resolver có thể lấy ra dùng
      req['auth'] = authPayload;
      this.clsService.set('auth', authPayload);
      return true;
 
  }
}
