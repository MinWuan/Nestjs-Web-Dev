import { Module } from '@nestjs/common';
import { CreateDemoUseCase } from './create';

@Module({
  imports: [CreateDemoUseCase],
  providers: [],
})
export class DemoUseCaseModule {}
