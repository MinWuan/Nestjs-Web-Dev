import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY, EXCLUDE_ROLES_KEY, ROLE_ALL } from '@/common/decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    // Nếu chưa login hoặc không có roles -> Chặn luôn
    if (!user || !user.roles) {
      throw new ForbiddenException('User roles not found');
    }

    // ====================================================
    // 1. XỬ LÝ BLACKLIST (Ngoại trừ)
    // ====================================================
    const excludedRoles = this.reflector.getAllAndOverride<string[]>(EXCLUDE_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (excludedRoles && excludedRoles.length > 0) {
      // Kiểm tra xem user có dính role nào bị cấm không
      const isBanned = excludedRoles.some((bannedRole) => user.roles.includes(bannedRole));
      if (isBanned) {
        throw new ForbiddenException('Bạn thuộc danh sách bị hạn chế quyền truy cập');
      }
      // Nếu có Blacklist mà user không bị dính, thì mặc định cho qua (hoặc check tiếp whitelist tuỳ logic)
      // Ở đây tôi để return true (nghĩa là: Trừ ông A ra, còn lại vào hết)
      return true; 
    }

    // ====================================================
    // 2. XỬ LÝ WHITELIST & WILDCARD (Cho phép)
    // ====================================================
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu không yêu cầu role gì đặc biệt -> Cho qua
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // CASE: Chấp nhận tất cả role (Wildcard '*')
    if (requiredRoles.includes(ROLE_ALL)) {
      return true;
    }

    // CASE: Check whitelist (Logic cũ)
    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(`Yêu cầu quyền: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}