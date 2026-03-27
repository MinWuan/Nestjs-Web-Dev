import { Module } from '@nestjs/common';
import { LoginUseCase } from './login';
import { UserModule } from '@/modules/user';
import { SessionModule } from '@/modules/session';

export { LoginUseCase };

@Module({
  imports: [UserModule, SessionModule],
  providers: [LoginUseCase],
  exports: [LoginUseCase],
})
export class AuthUseCaseModule {}
