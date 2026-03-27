import { Resolver, Args, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { SignatureGuard } from '@/common/guard/signature.guard';
import { Session } from '../../entity';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { PubSub } from 'graphql-subscriptions';
import { AppLogger } from '@/common/logger/app.logger';

@Resolver((of) => Session)
@UseGuards(SignatureGuard)
export class SessionSubscriptionResolver {
  constructor(
    private pubSub: PubSub,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('SessionSubResolver');
  }

  // =================================================================
  // CREATE DEMO (Subscription)
  // =================================================================
  @Subscription(() => resDto.SubCreatedSessionReturns, {
    resolve: (value) => ({
      ...value.data, // Spread tất cả fields của Session ra root level
      data: value.data, // Giữ lại data field
      deviceId: value.deviceId, // Giữ lại deviceId field
    }),
  })
  onCreate__Session(@Args('input') args: argsDto.SubCreatedSessionArgs) {
    const triggerName = `onCreate__Session__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName); //trả về kênh tương ứng để lắng nghe
  }

  async publishOnCreate__Session(data: { data: Session; deviceId: string }) {
    const triggerName = `onCreate__Session__${data.deviceId}`;
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
  @Subscription(() => resDto.SubUpdatedSessionReturns, {
    resolve: (value) => value,
  })
  onUpdate__Session(@Args('input') args: argsDto.SubUpdatedSessionArgs) {
    const triggerName = `onUpdate__Session__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName);
  }
  async publishOnUpdate__Session(data: { data: Session; deviceId: string }) {
    const triggerName = `onUpdate__Session__${data.deviceId}`;
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
  @Subscription(() => resDto.SubDeletedSessionReturns, {
    resolve: (value) => value,
  })
  onDelete__Session(@Args('input') args: argsDto.SubDeletedSessionArgs) {
    const triggerName = `onDelete__Session__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName);
  }
  async publishOnDelete__Session(data: { id: string; deviceId: string }) {
    const triggerName = `onDelete__Session__${data.deviceId}`;
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
