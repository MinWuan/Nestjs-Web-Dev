import { Module } from '@nestjs/common';
import { CreateRoleUseCase } from './create';

@Module({
  imports: [CreateRoleUseCase],
  providers: [],
})
export class RoleUseCaseModule {}
