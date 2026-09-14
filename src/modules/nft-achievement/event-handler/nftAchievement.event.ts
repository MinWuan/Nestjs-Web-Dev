import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NftAchievementRepositoryTypeorm } from '../repository/typeorm/nftAchievement';
import { AppLogger } from '@/common/logger/app.logger';
import {
  BlockchainEvent,
  IssueGrindCompletedEvent,
} from '@/modules/blockchain/event-handler';
import { PeriodTypeEnum } from '../entity/typeorm';
@Injectable()
export class NftAchievementEventHandler {
  constructor(
    private readonly nftAchievementRepository: NftAchievementRepositoryTypeorm,
    private readonly logger: AppLogger,
  ) {
    this.logger.log(`(﹙˓ ‍🎧 ˒﹚) NftAchievementEventHandler initialized`);
  }

  @OnEvent(BlockchainEvent.issueGrindCompleted.name, { async: true })
  async handleIssueGrindCompleted(payload: IssueGrindCompletedEvent) {
    this.logger.log(`🎧 ${BlockchainEvent.issueGrindCompleted.name}`, {
      payload: payload,
    });
    const data = await this.nftAchievementRepository.create({
      blockNumber: payload.achievementResult.blockNumber,
      blockTimestamp: payload.achievementResult.blockTimestamp,
      txHash: payload.achievementResult.txHash,
      txFeeCRO: payload.achievementResult.txFeeCRO,
      txFeeWei: payload.achievementResult.txFeeWei,
      gasUsed: payload.achievementResult.gasUsed,
      effectiveGasPrice: payload.achievementResult.effectiveGasPrice,
      network: payload.achievementResult.network,
      chainId: payload.achievementResult.chainId,
      contractAddress: payload.achievementResult.contractAddress,
      tokenId: payload.achievementResult.tokenId,
      certId: payload.achievementResult.certId,
      certType: payload.achievementResult.certType.toString(),
      certTypeName: payload.achievementResult.certTypeName,
      learnerAddress: payload.achievementResult.learnerAddress,
      learnerName: payload.achievementResult.learnerName,
      learnerEmail: payload.achievementResult.learnerEmail,
      issuedAt: payload.achievementResult.issuedAt,
      grind: {
        periodType: payload.achievementResult.grind?.periodType ?? PeriodTypeEnum.MONTHLY,
        periodLabel: payload.achievementResult.grind?.periodLabel ?? '',
        studyHours: payload.achievementResult.grind?.studyHours ?? 0,
        rank: payload.achievementResult.grind?.rank ?? 0,
      }
    });
    
    //if (!updated) return false;
    return true;
  }
}