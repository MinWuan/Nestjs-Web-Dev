import { Resolver, Args, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { SignatureGuard } from '@/common/guard/signature.guard';
import { Role } from '../../entity';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { PubSub } from 'graphql-subscriptions';
import { AppLogger } from '@/common/logger/app.logger';

@Resolver((of) => Role)
@UseGuards(SignatureGuard)
export class RoleSubscriptionResolver {
  constructor(
    private pubSub: PubSub,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('RoleSubResolver');
  }

  // =================================================================
  // CREATE DEMO (Subscription)
  // =================================================================
  @Subscription(() => resDto.SubCreatedRoleReturns, {
    resolve: (value) => ({
      ...value.data, // Spread tất cả fields của Role ra root level
      data: value.data, // Giữ lại data field
      deviceId: value.deviceId, // Giữ lại deviceId field
    }),
  })
  onCreate__Role(@Args('input') args: argsDto.SubCreatedRoleArgs) {
    const triggerName = `onCreate__Role__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName); //trả về kênh tương ứng để lắng nghe
  }

  async publishOnCreate__Role(data: { data: Role; deviceId: string }) {
    const triggerName = `onCreate__Role__${data.deviceId}`;
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
  @Subscription(() => resDto.SubUpdatedRoleReturns, {
    resolve: (value) => value,
  })
  onUpdate__Role(@Args('input') args: argsDto.SubUpdatedRoleArgs) {
    const triggerName = `onUpdate__Role__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName);
  }
  async publishOnUpdate__Role(data: { data: Role; deviceId: string }) {
    const triggerName = `onUpdate__Role__${data.deviceId}`;
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
  @Subscription(() => resDto.SubDeletedRoleReturns, {
    resolve: (value) => value,
  })
  onDelete__Role(@Args('input') args: argsDto.SubDeletedRoleArgs) {
    const triggerName = `onDelete__Role__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName);
  }
  async publishOnDelete__Role(data: { id: string; deviceId: string }) {
    const triggerName = `onDelete__Role__${data.deviceId}`;
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
