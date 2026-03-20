import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './create';

@Module({
  imports: [CreateUserUseCase],
  providers: [],
})
export class UserUseCaseModule {}
