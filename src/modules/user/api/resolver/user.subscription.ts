import { Resolver, Args, Subscription } from '@nestjs/graphql';
import {  UseGuards } from '@nestjs/common';

import { SignatureGuard } from '@/common/guard/signature.guard';
import { User } from '../../entity';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { PubSub } from 'graphql-subscriptions';
import { AppLogger } from '@/common/logger/app.logger';

@Resolver((of) => User)
@UseGuards(SignatureGuard)
export class UserSubscriptionResolver {
  constructor(
    private pubSub: PubSub,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('UserSubResolver');
  }

  // =================================================================
  // CREATE DEMO (Subscription)
  // =================================================================
  @Subscription(() => resDto.SubCreatedUserReturns, {
    resolve: (value) => ({
      ...value.data, // Spread tất cả fields của User ra root level
      data: value.data, // Giữ lại data field
      deviceId: value.deviceId, // Giữ lại deviceId field
    }),
  })
  onCreate__User(@Args('input') args: argsDto.SubCreatedUserArgs) {
    const triggerName = `onCreate__User__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName); //trả về kênh tương ứng để lắng nghe
  }

  async publishOnCreate__User(data: { data: User; deviceId: string }) {
    const triggerName = `onCreate__User__${data.deviceId}`;
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
  @Subscription(() => resDto.SubUpdatedUserReturns, {
    resolve: (value) => value,
  })
  onUpdate__User(@Args('input') args: argsDto.SubUpdatedUserArgs) {
    const triggerName = `onUpdate__User__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName);
  }
  async publishOnUpdate__User(data: { data: User; deviceId: string }) {
    const triggerName = `onUpdate__User__${data.deviceId}`;
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
  @Subscription(() => resDto.SubDeletedUserReturns, {
    resolve: (value) => value,
  })
  onDelete__User(@Args('input') args: argsDto.SubDeletedUserArgs) {
    const triggerName = `onDelete__User__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName);
  }
  async publishOnDelete__User(data: { id: string; deviceId: string }) {
    const triggerName = `onDelete__User__${data.deviceId}`;
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
