import { Module } from '@nestjs/common';
import { CreateS3UseCase } from './create';

@Module({
  imports: [CreateS3UseCase],
  providers: [],
})
export class S3UseCaseModule {}
