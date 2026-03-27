import { Module } from '@nestjs/common';
import { CreateSessionUseCase } from './create';

@Module({
  imports: [CreateSessionUseCase],
  providers: [],
})
export class SessionUseCaseModule {}
