import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
  Subscription,
} from '@nestjs/graphql';

import { DeviceId } from '@/common/decorator/device-id.decorator';
import { Session } from '../../entity';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { SessionRepositoryTypeorm } from '../../repository';
import { SessionSubscriptionResolver } from './session.subscription';
import { GqlAppException } from '@/common/exception/GqlAppException';
import { AppLogger } from '@/common/logger/app.logger';

@Resolver((of) => Session)
export class SessionMutationResolver {
  constructor(
    private sessionRepository: SessionRepositoryTypeorm,
    private sessionSubscriptionResolver: SessionSubscriptionResolver,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('SessionMutationResolver');
  }

  // =================================================================
  // CREATE DEMO (Single Insert)
  // =================================================================
  @Mutation(() => resDto.CreateSessionReturns)
  async create__Session(
    @Args('input') args: argsDto.CreateSessionArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.CreateSessionReturns> {
    const session = await this.sessionRepository.create(args).catch((error) => {
      throw GqlAppException.DatabaseError({
        message: 'Failed to create session',
        details: error,
      });
    });
    if (deviceId) {
      // Publish sự kiện sau khi tạo thành công
      await this.sessionSubscriptionResolver.publishOnCreate__Session({
        data: session,
        deviceId: deviceId,
      });
    }
    return session;
  }
  // =================================================================
  // UPDATE DEMO (Single Update)
  // =================================================================
  @Mutation(() => resDto.UpdateSessionReturns)
  async update__Session(
    @Args('input') args: argsDto.UpdateSessionArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.UpdateSessionReturns> {
    const { _id, ...updateData } = args;
    const session = await this.sessionRepository
      .update(_id, updateData)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: `Failed to update session with ID ${args._id}`,
          details: error,
        });
      });
    if (!session) {
      throw GqlAppException.NotFound({
        message: `Session with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi cập nhật thành công
      await this.sessionSubscriptionResolver.publishOnUpdate__Session({
        data: session,
        deviceId: deviceId,
      });
    }
    return session;
  }

  // =================================================================
  // DELETE DEMO (Single Delete)
  // =================================================================
  @Mutation(() => resDto.DeleteSessionReturns)
  async delete__Session(
    @Args('input') args: argsDto.DeleteSessionArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.DeleteSessionReturns> {
    const result = await this.sessionRepository.delete(args._id).catch((error) => {
      throw GqlAppException.DatabaseError({
        message: `Failed to delete session with ID ${args._id}`,
        details: error,
      });
    });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: `Session with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi xóa thành công
      await this.sessionSubscriptionResolver.publishOnDelete__Session({
        id: args._id,
        deviceId: deviceId,
      });
    }
    return result;
  }

  // =================================================================
  // CREATE DEMOS (MULTI INSERT)
  // =================================================================
  @Mutation(() => resDto.CreateSessionsReturns)
  async createMany__Sessions(
    @Args('input') args: argsDto.CreateSessionsArgs,
  ): Promise<resDto.CreateSessionsReturns> {
    const result = await this.sessionRepository
      .createMany(args.sessions)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to create multiple sessions',
          details: error,
        });
      });
    return result;
  }

  // =================================================================
  // UPDATE DEMOS (MULTI UPDATE)
  // =================================================================
  @Mutation(() => resDto.UpdateSessionsReturns)
  async updateMany__Session(
    @Args('input') args: argsDto.UpdateSessionsArgs,
  ): Promise<resDto.UpdateSessionsReturns> {
    const result = await this.sessionRepository
      .updateMany(args.ids, args.data)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to update multiple sessions',
          details: error,
        });
      });
    if (result.matchedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No sessions found with the provided IDs',
      });
    }
    return result;
  }

  // =================================================================
  // DELETE DEMOS (MULTI DELETE)
  // =================================================================
  @Mutation(() => resDto.DeleteSessionsReturns)
  async deleteMany__Session(
    @Args('input') args: argsDto.DeleteSessionsArgs,
  ): Promise<resDto.DeleteSessionsReturns> {
    const result = await this.sessionRepository
      .deleteMany(args.ids)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to delete multiple sessions',
          details: error,
        });
      });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No sessions found with the provided IDs',
      });
    }
    return result;
  }
}
