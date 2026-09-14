import { Resolver, Args, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { SignatureGuard } from '@/common/guard/signature.guard';
import { NftAchievement } from '../../entity';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { PubSub } from 'graphql-subscriptions';
import { AppLogger } from '@/common/logger/app.logger';

@Resolver((of) => NftAchievement)
@UseGuards(SignatureGuard)
export class NftAchievementSubscriptionResolver {
  constructor(
    private pubSub: PubSub,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('NftAchievementSubResolver');
  }

  // =================================================================
  // CREATE DEMO (Subscription)
  // =================================================================
  @Subscription(() => resDto.SubCreatedNftAchievementReturns, {
    resolve: (value) => ({
      ...value.data, // Spread tất cả fields của NftAchievement ra root level
      data: value.data, // Giữ lại data field
      deviceId: value.deviceId, // Giữ lại deviceId field
    }),
  })
  onCreate__NftAchievement(@Args('input') args: argsDto.SubCreatedNftAchievementArgs) {
    const triggerName = `onCreate__NftAchievement__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName); //trả về kênh tương ứng để lắng nghe
  }

  async publishOnCreate__NftAchievement(data: { data: NftAchievement; deviceId: string }) {
    const triggerName = `onCreate__NftAchievement__${data.deviceId}`;
    const payload = {
      data: data.data,
      deviceId: data.deviceId,
    };
    const result = await this.pubSub
      .publish(triggerName, payload)
      .then(() => {
        this.logger.log(`✅ Published event to ${triggerName}`, payload);
      })
      .catch((error) => {
        this.logger.error({
          message: `❌ Failed to publish event to ${triggerName}`,
          trace: error,
        });
      });
    return result;
  }

  // =================================================================
  // UPDATE DEMO (Subscription)
  // =================================================================
  @Subscription(() => resDto.SubUpdatedNftAchievementReturns, {
    resolve: (value) => value,
  })
  onUpdate__NftAchievement(@Args('input') args: argsDto.SubUpdatedNftAchievementArgs) {
    const triggerName = `onUpdate__NftAchievement__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName);
  }
  async publishOnUpdate__NftAchievement(data: { data: NftAchievement; deviceId: string }) {
    const triggerName = `onUpdate__NftAchievement__${data.deviceId}`;
    const payload = {
      data: data.data,
      deviceId: data.deviceId,
    };
    const result = await this.pubSub
      .publish(triggerName, payload)
      .then(() => {
        this.logger.log(`✅ Published event to ${triggerName}`);
      })
      .catch((error) => {
        this.logger.error({
          message: `❌ Failed to publish event to ${triggerName}`,
          trace: error,
        });
      });
    return result;
  }

  // =================================================================
  // DELETE DEMO (Subscription)
  // =================================================================
  @Subscription(() => resDto.SubDeletedNftAchievementReturns, {
    resolve: (value) => value,
  })
  onDelete__NftAchievement(@Args('input') args: argsDto.SubDeletedNftAchievementArgs) {
    const triggerName = `onDelete__NftAchievement__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName);
  }
  async publishOnDelete__NftAchievement(data: { id: string; deviceId: string }) {
    const triggerName = `onDelete__NftAchievement__${data.deviceId}`;
    const payload = {
      id: data.id,
      deviceId: data.deviceId,
    };
    const result = await this.pubSub
      .publish(triggerName, payload)
      .then(() => {
        this.logger.log(`✅ Published event to ${triggerName}`);
      })
      .catch((error) => {
        this.logger.error({
          message: `❌ Failed to publish event to ${triggerName}`,
          trace: error,
        });
      });
    return result;
  }
}
