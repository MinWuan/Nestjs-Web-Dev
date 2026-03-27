import { Resolver } from '@nestjs/graphql';
import { AppLogger } from '@/common/logger/app.logger';

@Resolver()
export class BlockchainFieldResolver {
  constructor(private readonly logger: AppLogger) {
    this.logger.setPrefix('BlockchainFieldResolver');
  }
}
