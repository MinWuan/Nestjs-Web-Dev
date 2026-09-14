import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RankRecordRepositoryTypeorm } from '../repository/typeorm/rankRecord';
import { AppLogger } from '@/common/logger/app.logger';
import {
  BlockchainEvent,
  IssueGrindCompletedEvent,
} from '@/modules/blockchain/event-handler';

@Injectable()
export class RankRecordEventHandler {
  constructor(
    private readonly rankRecordRepository: RankRecordRepositoryTypeorm,
    private readonly logger: AppLogger,
  ) {
    this.logger.log(`(﹙˓ ‍🎧 ˒﹚) RankRecordEventHandler initialized`);
  }

  @OnEvent(BlockchainEvent.issueGrindCompleted.name, { async: true })
  async handleIssueGrindCompleted(payload: IssueGrindCompletedEvent) {
    this.logger.log(`🎧 ${BlockchainEvent.issueGrindCompleted.name}`, {
      payload: payload,
    });
    const updated =
      await this.rankRecordRepository.updateOneMilestonesTotalUptime({
        month: payload.month,
        year: payload.year,
        userId: payload.userId,
        milestone: payload.milestone,
        newStatus: payload.newStatus as any,
      })
    if (!updated) return false;
    return true;
  }
}
