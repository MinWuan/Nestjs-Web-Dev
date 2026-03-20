import { Module } from '@nestjs/common';
import { CreateRoleTestUseCase } from './create';

@Module({
  imports: [CreateRoleTestUseCase],
  providers: [],
})
export class RoleTestUseCaseModule {}
