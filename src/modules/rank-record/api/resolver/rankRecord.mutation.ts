import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
  Subscription,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { DeviceId } from '@/common/decorator/device-id.decorator';
import { RankRecord } from '../../entity';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { RankRecordRepositoryTypeorm } from '../../repository';
import { RankRecordSubscriptionResolver } from './rankRecord.subscription';
import { GqlAppException } from '@/common/exception/GqlAppException';
import { AppLogger } from '@/common/logger/app.logger';
import { SignatureGuard } from '@/common/guard/signature.guard';

@Resolver((of) => RankRecord)
@UseGuards(SignatureGuard)
export class RankRecordMutationResolver {
  constructor(
    private rankRecordRepository: RankRecordRepositoryTypeorm,
    private rankRecordSubscriptionResolver: RankRecordSubscriptionResolver,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('RankRecordMutationResolver');
  }

  // =================================================================
  // CREATE DEMO (Single Insert)
  // =================================================================
  @Mutation(() => resDto.CreateRankRecordReturns)
  async create__RankRecord(
    @Args('input') args: argsDto.CreateRankRecordArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.CreateRankRecordReturns> {
    const rankRecord = await this.rankRecordRepository
      .create(args)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to create rankRecord',
          details: error,
        });
      });
    if (deviceId) {
      // Publish sự kiện sau khi tạo thành công
      await this.rankRecordSubscriptionResolver.publishOnCreate__RankRecord({
        data: rankRecord,
        deviceId: deviceId,
      });
    }
    return rankRecord;
  }
  // =================================================================
  // UPDATE DEMO (Single Update)
  // =================================================================
  @Mutation(() => resDto.UpdateRankRecordReturns)
  async update__RankRecord(
    @Args('input') args: argsDto.UpdateRankRecordArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.UpdateRankRecordReturns> {
    const { _id, ...updateData } = args;
    const rankRecord = await this.rankRecordRepository
      .update(_id, updateData)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: `Failed to update rankRecord with ID ${args._id}`,
          details: error,
        });
      });
    if (!rankRecord) {
      throw GqlAppException.NotFound({
        message: `RankRecord with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi cập nhật thành công
      await this.rankRecordSubscriptionResolver.publishOnUpdate__RankRecord({
        data: rankRecord,
        deviceId: deviceId,
      });
    }
    return rankRecord;
  }

  // =================================================================
  // DELETE DEMO (Single Delete)
  // =================================================================
  @Mutation(() => resDto.DeleteRankRecordReturns)
  async delete__RankRecord(
    @Args('input') args: argsDto.DeleteRankRecordArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.DeleteRankRecordReturns> {
    const result = await this.rankRecordRepository
      .delete(args._id)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: `Failed to delete rankRecord with ID ${args._id}`,
          details: error,
        });
      });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: `RankRecord with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi xóa thành công
      await this.rankRecordSubscriptionResolver.publishOnDelete__RankRecord({
        id: args._id,
        deviceId: deviceId,
      });
    }
    return result;
  }

  // =================================================================
  // CREATE DEMOS (MULTI INSERT)
  // =================================================================
  @Mutation(() => resDto.CreateRankRecordsReturns)
  async createMany__RankRecords(
    @Args('input') args: argsDto.CreateRankRecordsArgs,
  ): Promise<resDto.CreateRankRecordsReturns> {
    const result = await this.rankRecordRepository
      .createMany(args.rankRecords)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to create multiple rankRecords',
          details: error,
        });
      });
    return result;
  }

  // =================================================================
  // UPDATE DEMOS (MULTI UPDATE)
  // =================================================================
  @Mutation(() => resDto.UpdateRankRecordsReturns)
  async updateMany__RankRecord(
    @Args('input') args: argsDto.UpdateRankRecordsArgs,
  ): Promise<resDto.UpdateRankRecordsReturns> {
    const result = await this.rankRecordRepository
      .updateMany(args.ids, args.data)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to update multiple rankRecords',
          details: error,
        });
      });
    if (result.matchedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No rankRecords found with the provided IDs',
      });
    }
    return result;
  }

  // =================================================================
  // DELETE DEMOS (MULTI DELETE)
  // =================================================================
  @Mutation(() => resDto.DeleteRankRecordsReturns)
  async deleteMany__RankRecord(
    @Args('input') args: argsDto.DeleteRankRecordsArgs,
  ): Promise<resDto.DeleteRankRecordsReturns> {
    const result = await this.rankRecordRepository
      .deleteMany(args.ids)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to delete multiple rankRecords',
          details: error,
        });
      });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No rankRecords found with the provided IDs',
      });
    }
    return result;
  }

  // =================================================================
  // UPSERT LEADERBOARD ENTRY (thêm/cập nhật entry vào leaderboard)
  // =================================================================
  @Mutation(() => resDto.UpsertLeaderboardEntryReturns)
  async upsertLeaderboardEntry__RankRecord(
    @Args('input') args: argsDto.UpsertLeaderboardEntryArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.UpsertLeaderboardEntryReturns> {
    const rankRecord = await this.rankRecordRepository
      .upsertLeaderboardEntry({
        month: args.month,
        year: args.year,
        entry: args.entry,
      })
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to upsert leaderboard entry',
          details: error,
        });
      });
    if (deviceId) {
      await this.rankRecordSubscriptionResolver.publishOnUpdate__RankRecord({
        data: rankRecord,
        deviceId: deviceId,
      });
    }
    return rankRecord;
  }
}
