import { Module } from '@nestjs/common';
import { DolphintutorAchievementService } from './achievement.service';
import { DolphintutorAchievementController } from './achievement.controller';

// ─── Module ──────────────────────────────────────────────────────────────────

@Module({
  providers: [DolphintutorAchievementService],
  controllers: [DolphintutorAchievementController],
  exports: [DolphintutorAchievementService],
})
export class BlockchainModule {}
