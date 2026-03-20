import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const EXCLUDE_ROLES_KEY = 'exclude_roles';

// 1. Decorator cho phép (Whitelist)
export const Roles = (roles: string[]) => SetMetadata(ROLES_KEY, roles);

// 2. Decorator từ chối (Blacklist) - Mới thêm
export const ExcludeRoles = (roles: string[]) => SetMetadata(EXCLUDE_ROLES_KEY, roles);

// 3. Hằng số cho trường hợp "Tất cả"
export const ROLE_ALL = '*';