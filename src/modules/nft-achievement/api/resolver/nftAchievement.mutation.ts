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
import { NftAchievement } from '../../entity';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { NftAchievementRepositoryTypeorm } from '../../repository';
import { NftAchievementSubscriptionResolver } from './nftAchievement.subscription';
import { GqlAppException } from '@/common/exception/GqlAppException';
import { AppLogger } from '@/common/logger/app.logger';

@Resolver((of) => NftAchievement)
export class NftAchievementMutationResolver {
  constructor(
    private nftAchievementRepository: NftAchievementRepositoryTypeorm,
    private nftAchievementSubscriptionResolver: NftAchievementSubscriptionResolver,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('NftAchievementMutationResolver');
  }

  // =================================================================
  // CREATE DEMO (Single Insert)
  // =================================================================
  @Mutation(() => resDto.CreateNftAchievementReturns)
  async create__NftAchievement(
    @Args('input') args: argsDto.CreateNftAchievementArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.CreateNftAchievementReturns> {
    const nftAchievement = await this.nftAchievementRepository.create(args).catch((error) => {
      throw GqlAppException.DatabaseError({
        message: 'Failed to create nftAchievement',
        details: error,
      });
    });
    if (deviceId) {
      // Publish sự kiện sau khi tạo thành công
      await this.nftAchievementSubscriptionResolver.publishOnCreate__NftAchievement({
        data: nftAchievement,
        deviceId: deviceId,
      });
    }
    return nftAchievement;
  }
  // =================================================================
  // UPDATE DEMO (Single Update)
  // =================================================================
  @Mutation(() => resDto.UpdateNftAchievementReturns)
  async update__NftAchievement(
    @Args('input') args: argsDto.UpdateNftAchievementArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.UpdateNftAchievementReturns> {
    const { _id, ...updateData } = args;
    const nftAchievement = await this.nftAchievementRepository
      .update(_id, updateData)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: `Failed to update nftAchievement with ID ${args._id}`,
          details: error,
        });
      });
    if (!nftAchievement) {
      throw GqlAppException.NotFound({
        message: `NftAchievement with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi cập nhật thành công
      await this.nftAchievementSubscriptionResolver.publishOnUpdate__NftAchievement({
        data: nftAchievement,
        deviceId: deviceId,
      });
    }
    return nftAchievement;
  }

  // =================================================================
  // DELETE DEMO (Single Delete)
  // =================================================================
  @Mutation(() => resDto.DeleteNftAchievementReturns)
  async delete__NftAchievement(
    @Args('input') args: argsDto.DeleteNftAchievementArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.DeleteNftAchievementReturns> {
    const result = await this.nftAchievementRepository.delete(args._id).catch((error) => {
      throw GqlAppException.DatabaseError({
        message: `Failed to delete nftAchievement with ID ${args._id}`,
        details: error,
      });
    });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: `NftAchievement with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi xóa thành công
      await this.nftAchievementSubscriptionResolver.publishOnDelete__NftAchievement({
        id: args._id,
        deviceId: deviceId,
      });
    }
    return result;
  }

  // =================================================================
  // CREATE DEMOS (MULTI INSERT)
  // =================================================================
  @Mutation(() => resDto.CreateNftAchievementsReturns)
  async createMany__NftAchievements(
    @Args('input') args: argsDto.CreateNftAchievementsArgs,
  ): Promise<resDto.CreateNftAchievementsReturns> {
    const result = await this.nftAchievementRepository
      .createMany(args.nftAchievements)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to create multiple nftAchievements',
          details: error,
        });
      });
    return result;
  }

  // =================================================================
  // UPDATE DEMOS (MULTI UPDATE)
  // =================================================================
  @Mutation(() => resDto.UpdateNftAchievementsReturns)
  async updateMany__NftAchievement(
    @Args('input') args: argsDto.UpdateNftAchievementsArgs,
  ): Promise<resDto.UpdateNftAchievementsReturns> {
    const result = await this.nftAchievementRepository
      .updateMany(args.ids, args.data)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to update multiple nftAchievements',
          details: error,
        });
      });
    if (result.matchedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No nftAchievements found with the provided IDs',
      });
    }
    return result;
  }

  // =================================================================
  // DELETE DEMOS (MULTI DELETE)
  // =================================================================
  @Mutation(() => resDto.DeleteNftAchievementsReturns)
  async deleteMany__NftAchievement(
    @Args('input') args: argsDto.DeleteNftAchievementsArgs,
  ): Promise<resDto.DeleteNftAchievementsReturns> {
    const result = await this.nftAchievementRepository
      .deleteMany(args.ids)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to delete multiple nftAchievements',
          details: error,
        });
      });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No nftAchievements found with the provided IDs',
      });
    }
    return result;
  }
}
