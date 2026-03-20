import { Resolver, Args, Subscription } from '@nestjs/graphql';
import { UsePipes,UseGuards } from '@nestjs/common';

import { graphqlValidationPipe } from '@/shared/pipes/validation.pipe';
import { SignatureGuard } from '@/common/guard/signature.guard';
import { Demo } from '../../entity';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { GqlAppException } from '@/common/exception/GqlAppException';
import { PubSub } from 'graphql-subscriptions';
import { AppLogger } from '@/common/logger/app.logger';

@Resolver((of) => Demo)
@UsePipes(graphqlValidationPipe)
@UseGuards(SignatureGuard)
export class DemoSubscriptionResolver {
  constructor(
    private pubSub: PubSub,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('DemoSubResolver');
  }

  // =================================================================
  // CREATE DEMO (Subscription)
  // =================================================================
  @Subscription(() => resDto.SubCreatedDemoReturns, {
    resolve: (value) => ({
      ...value.data, // Spread tất cả fields của Demo ra root level
      data: value.data, // Giữ lại data field
      deviceId: value.deviceId, // Giữ lại deviceId field
    }),
  })
  onCreate__Demo(@Args('input') args: argsDto.SubCreatedDemoArgs) {
    const triggerName = `onCreate__Demo__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName); //trả về kênh tương ứng để lắng nghe
  }

  async publishOnCreate__Demo(data: { data: Demo; deviceId: string }) {
    const triggerName = `onCreate__Demo__${data.deviceId}`;
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
  @Subscription(() => resDto.SubUpdatedDemoReturns, {
    resolve: (value) => value,
  })
  onUpdate__Demo(@Args('input') args: argsDto.SubUpdatedDemoArgs) {
    const triggerName = `onUpdate__Demo__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName);
  }
  async publishOnUpdate__Demo(data: { data: Demo; deviceId: string }) {
    const triggerName = `onUpdate__Demo__${data.deviceId}`;
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
  @Subscription(() => resDto.SubDeletedDemoReturns, {
    resolve: (value) => value,
  })
  onDelete__Demo(@Args('input') args: argsDto.SubDeletedDemoArgs) {
    const triggerName = `onDelete__Demo__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName);
  }
  async publishOnDelete__Demo(data: { id: string; deviceId: string }) {
    const triggerName = `onDelete__Demo__${data.deviceId}`;
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
