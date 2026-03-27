import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthMutationResolver } from './api/resolver/auth.mutation';
import { UserModule } from '@/modules/user';
import { SessionModule } from '@/modules/session';
import { AuthUseCaseModule } from './use-case';

export { AuthService };

@Module({
  imports: [UserModule, SessionModule, AuthUseCaseModule],
  providers: [AuthService, AuthMutationResolver],
  exports: [],
})
export class AuthModule {}
