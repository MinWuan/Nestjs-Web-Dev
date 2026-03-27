import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementUseCase } from './use-case';
import { DolphintutorAchievementController } from './achievement.controller';
import { BlockchainMutationResolver } from './api/resolver/blockchain.mutation';
import { BlockchainFieldResolver } from './api/resolver/blockchain.field';
import { UserModule } from '@/modules/user';
import { IssueGrindCompletedEvent } from './event-handler';

export { AchievementService,IssueGrindCompletedEvent };

// ─── Module ──────────────────────────────────────────────────────────────────

@Module({
  imports: [UserModule],
  providers: [
    AchievementService,
    AchievementUseCase,
    // GraphQL Resolvers
    BlockchainMutationResolver,
    BlockchainFieldResolver,
  ],
  controllers: [DolphintutorAchievementController],
  exports: [AchievementService],
})
export class BlockchainModule {}
