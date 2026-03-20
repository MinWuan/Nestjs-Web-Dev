import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles, ExcludeRoles, ROLE_ALL } from './roles.decorator';
import { AuthGuard } from '@/common/guard/auth.guard';
import { RolesGuard } from '@/common/guard/roles.guard';

// Option 1: Whitelist (Cho phép danh sách này)
export function Auth(roles: string[] = []) {
  return applyDecorators(Roles(roles), UseGuards(AuthGuard, RolesGuard));
}

// Option 2: Blacklist (Cấm danh sách này, còn lại cho vào hết)
export function AuthExclude(roles: string[]) {
  return applyDecorators(ExcludeRoles(roles), UseGuards(AuthGuard, RolesGuard));
}

// Option 3: Allow All (Chỉ cần login là được)
export function AuthAll() {
  return applyDecorators(
    Roles([ROLE_ALL]), // Truyền dấu '*'
    UseGuards(AuthGuard, RolesGuard),
  );
}
