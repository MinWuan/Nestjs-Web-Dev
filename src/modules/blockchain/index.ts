import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { BlockchainEventHandler } from './event-handler/blockchain.event';
import { DolphintutorAchievementController } from './achievement.controller';
import { BlockchainMutationResolver } from './api/resolver/blockchain.mutation';
import { BlockchainFieldResolver } from './api/resolver/blockchain.field';
import { UserModule } from '@/modules/user';
import { IssueGrindCompletedEvent } from './event-handler';
import * as entity from './entity';

export { AchievementService, IssueGrindCompletedEvent, entity };

// ─── Module ──────────────────────────────────────────────────────────────────

@Module({
  imports: [UserModule],
  providers: [
    AchievementService,
    //Event Handlers
    BlockchainEventHandler,
    // GraphQL Resolvers
    BlockchainMutationResolver,
    BlockchainFieldResolver,
  ],
  controllers: [DolphintutorAchievementController],
  exports: [AchievementService],
})
export class BlockchainModule {}
