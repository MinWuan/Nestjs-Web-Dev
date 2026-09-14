import { Global, Module } from '@nestjs/common';
import { SessionModule } from '@/modules/session';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

@Global()
@Module({
  imports: [SessionModule],
  providers: [AuthGuard, RolesGuard],
  exports: [AuthGuard, RolesGuard, SessionModule],
})
export class GuardModule {}
