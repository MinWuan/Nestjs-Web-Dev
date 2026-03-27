import { Injectable } from '@nestjs/common';
import { AchievementService } from '@/modules/blockchain';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { RankRecordEvent, MilestoneReachedEvent } from '@/modules/rank-record/event-handler';
import { UserRepositoryFacade } from '@/modules/user';
import { PeriodType } from '@/modules/blockchain/achievement.service';
import { AppLogger } from '@/common/logger/app.logger';
import { BlockchainEvent } from '@/modules/blockchain/event-handler';
import { TotalUptimeStatusEnum } from '@/modules/rank-record';

@Injectable()
export class AchievementUseCase {
  constructor(
    private achievementService: AchievementService,
    private userRepository: UserRepositoryFacade,
    private logger: AppLogger,
    private eventEmitter: EventEmitter2,
  ) {
    //this.logger.log('🎧 AchievementUseCase instantiated');
  }

  @OnEvent(RankRecordEvent.milestoneReached.name, { async: true })
  async handleMilestoneReached(payload: MilestoneReachedEvent) {
    this.logger.log(`🎧 ${RankRecordEvent.milestoneReached.name}`, {
      payload: payload,
    });
    const { month, year, userId, totalUptime, milestone } = payload;
    const user = await this.userRepository.findById(userId);
    if (user && user?.walletAddress) {
      //Cấp chứng nhận thành tích theo loại milestone
      const result = await this.achievementService
        .issueGrind({
          learnerAddress: user.walletAddress,
          learnerName: user.fullname ?? '',
          learnerEmail: user.email ?? '',
          periodType: PeriodType.MONTHLY,
          periodLabel: `Tháng ${month}/${year}`,
          studyHours: milestone,
        })
        .then((result) => {
          this.logger.log(`✅ Đã cấp chứng nhận thành công`, {
            result: result,
          });
          const event = this.eventEmitter.emit(
            BlockchainEvent.issueGrindCompleted.name,
            new BlockchainEvent.issueGrindCompleted.payload({
              month: month,
              year: year,
              userId: userId,
              milestone: milestone,
              newStatus: TotalUptimeStatusEnum.COMPLETED,
            }),
          );
          if (!event) {
            this.logger.error({
              message: `⚠️ ${BlockchainEvent.issueGrindCompleted.name} not delivered`,
            });
          }
        });
      // .catch((err) => {
      //   this.logger.error({
      //     message: `🚨 Error in handleMilestoneReached: ${err?.message}`,
      //     trace: err instanceof Error ? err.stack : '',
      //   });
      //   return false;
      // });

      //Lưu vào NFT của user
      return true;
    }
    return false;
  }
}
