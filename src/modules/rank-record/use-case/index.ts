import { Module } from '@nestjs/common';
import { CreateRankRecordUseCase } from './create';

@Module({
  imports: [CreateRankRecordUseCase],
  providers: [],
})
export class RankRecordUseCaseModule {}
