export {};
import { User } from '@/modules/user';
import { Role } from '@/modules/role';

declare global {
  interface AuthPayload {
    user?: User;
    role?: Role;
  }
}
