import { Resolver, Args, Subscription } from '@nestjs/graphql';
import { UsePipes, UseGuards } from '@nestjs/common';

import { graphqlValidationPipe } from '@/shared/pipes/validation.pipe';
import { SignatureGuard } from '@/common/guard/signature.guard';
import { RoleTest } from '../../entity';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { GqlAppException } from '@/common/exception/GqlAppException';
import { PubSub } from 'graphql-subscriptions';
import { AppLogger } from '@/common/logger/app.logger';

@Resolver((of) => RoleTest)
@UsePipes(graphqlValidationPipe)
@UseGuards(SignatureGuard)
export class RoleTestSubscriptionResolver {
  constructor(
    private pubSub: PubSub,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('RoleTestSubResolver');
  }

  // =================================================================
  // CREATE DEMO (Subscription)
  // =================================================================
  @Subscription(() => resDto.SubCreatedRoleTestReturns, {
    resolve: (value) => ({
      ...value.data, // Spread tất cả fields của RoleTest ra root level
      data: value.data, // Giữ lại data field
      deviceId: value.deviceId, // Giữ lại deviceId field
    }),
  })
  onCreate__RoleTest(@Args('input') args: argsDto.SubCreatedRoleTestArgs) {
    const triggerName = `onCreate__RoleTest__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName); //trả về kênh tương ứng để lắng nghe
  }

  async publishOnCreate__RoleTest(data: { data: RoleTest; deviceId: string }) {
    const triggerName = `onCreate__RoleTest__${data.deviceId}`;
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
  @Subscription(() => resDto.SubUpdatedRoleTestReturns, {
    resolve: (value) => value,
  })
  onUpdate__RoleTest(@Args('input') args: argsDto.SubUpdatedRoleTestArgs) {
    const triggerName = `onUpdate__RoleTest__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName);
  }
  async publishOnUpdate__RoleTest(data: { data: RoleTest; deviceId: string }) {
    const triggerName = `onUpdate__RoleTest__${data.deviceId}`;
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
  @Subscription(() => resDto.SubDeletedRoleTestReturns, {
    resolve: (value) => value,
  })
  onDelete__RoleTest(@Args('input') args: argsDto.SubDeletedRoleTestArgs) {
    const triggerName = `onDelete__RoleTest__${args.deviceId}`;
    this.logger.log(`🎧 Client đang lắng nghe kênh: ${triggerName}`);
    return this.pubSub.asyncIterableIterator(triggerName);
  }
  async publishOnDelete__RoleTest(data: { id: string; deviceId: string }) {
    const triggerName = `onDelete__RoleTest__${data.deviceId}`;
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
