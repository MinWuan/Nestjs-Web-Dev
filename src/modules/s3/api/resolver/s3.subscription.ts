import { Resolver, Args, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { SignatureGuard } from '@/common/guard/signature.guard';
import { S3 } from '../../entity';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { PubSub } from 'graphql-subscriptions';
import { AppLogger } from '@/common/logger/app.logger';

@Resolver((of) => S3)
@UseGuards(SignatureGuard)
export class S3SubscriptionResolver {
  constructor(
    private pubSub: PubSub,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('S3SubResolver');
  }

  // =================================================================
  // CREATE DEMO (Subscription)
  // =================================================================
  @Subscription(() => resDto.SubCreatedS3Returns, {
    resolve: (value) => ({
      ...value.data, // Spread tất cả fields của S3 ra root level
      data: value.data, // Giữ lại data field
      deviceId: value.deviceId, // Giữ lại deviceId field
    }),
  })
  onCreate__S3(@Args('input') args: argsDto.SubCreatedS3Args) {
    const triggerName = `onCreate__S3__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName); //trả về kênh tương ứng để lắng nghe
  }

  async publishOnCreate__S3(data: { data: S3; deviceId: string }) {
    const triggerName = `onCreate__S3__${data.deviceId}`;
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
  @Subscription(() => resDto.SubUpdatedS3Returns, {
    resolve: (value) => value,
  })
  onUpdate__S3(@Args('input') args: argsDto.SubUpdatedS3Args) {
    const triggerName = `onUpdate__S3__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName);
  }
  async publishOnUpdate__S3(data: { data: S3; deviceId: string }) {
    const triggerName = `onUpdate__S3__${data.deviceId}`;
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
  @Subscription(() => resDto.SubDeletedS3Returns, {
    resolve: (value) => value,
  })
  onDelete__S3(@Args('input') args: argsDto.SubDeletedS3Args) {
    const triggerName = `onDelete__S3__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName);
  }
  async publishOnDelete__S3(data: { id: string; deviceId: string }) {
    const triggerName = `onDelete__S3__${data.deviceId}`;
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
