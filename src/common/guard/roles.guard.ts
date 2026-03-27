import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  ROLES_KEY,
  EXCLUDE_ROLES_KEY,
  ROLE_ALL,
} from '@/common/decorator/roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const authPayload: AuthPayload = ctx.getContext().req['auth'];

    // Nếu chưa login hoặc không có roles -> Chặn luôn
    if (!authPayload?.role) {
      throw new InternalServerErrorException('Failed to authenticate');
    }
    const nameRole = authPayload?.role?.role?.toUpperCase();

    // ====================================================
    // 1. XỬ LÝ BLACKLIST (Ngoại trừ)
    // ====================================================
    const excludedRoles = this.reflector.getAllAndOverride<string[]>(
      EXCLUDE_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (excludedRoles && excludedRoles.length > 0) {
      // Kiểm tra xem user có dính role nào bị cấm không
      const isBanned = excludedRoles.some((bannedRole) =>
        nameRole === bannedRole.toUpperCase(),
      );
      if (isBanned) {
        throw new ForbiddenException(
          `You are restricted from accessing this resource`,
        );
      }
      // Nếu có Blacklist mà user không bị dính, thì mặc định cho qua (hoặc check tiếp whitelist tuỳ logic)
      // Ở đây tôi để return true (nghĩa là: Trừ ông A ra, còn lại vào hết)
      return true;
    }

    // ====================================================
    // 2. XỬ LÝ WHITELIST & WILDCARD (Cho phép)
    // ====================================================
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu không yêu cầu role gì đặc biệt -> Cho qua
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // CASE: Chấp nhận tất cả role (Wildcard '*')
    if (requiredRoles.includes(ROLE_ALL)) {
      return true;
    }

    // CASE: Check whitelist (Logic cũ)
    const hasRole = requiredRoles.some((role) => nameRole === role.toUpperCase());
    if (!hasRole) {
      throw new ForbiddenException(
        `You are required to have one of the following roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
