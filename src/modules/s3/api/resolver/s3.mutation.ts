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
import { S3 } from '../../entity';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { S3RepositoryTypeorm } from '../../repository';
import { S3SubscriptionResolver } from './s3.subscription';
import { GqlAppException } from '@/common/exception/GqlAppException';
import { AppLogger } from '@/common/logger/app.logger';

@Resolver((of) => S3)
export class S3MutationResolver {
  constructor(
    private s3Repository: S3RepositoryTypeorm,
    private s3SubscriptionResolver: S3SubscriptionResolver,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('S3MutationResolver');
  }

  // =================================================================
  // CREATE DEMO (Single Insert)
  // =================================================================
  @Mutation(() => resDto.CreateS3Returns)
  async create__S3(
    @Args('input') args: argsDto.CreateS3Args,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.CreateS3Returns> {
    const s3 = await this.s3Repository.create(args).catch((error) => {
      throw GqlAppException.DatabaseError({
        message: 'Failed to create s3',
        details: error,
      });
    });
    if (deviceId) {
      // Publish sự kiện sau khi tạo thành công
      await this.s3SubscriptionResolver.publishOnCreate__S3({
        data: s3,
        deviceId: deviceId,
      });
    }
    return s3;
  }
  // =================================================================
  // UPDATE DEMO (Single Update)
  // =================================================================
  @Mutation(() => resDto.UpdateS3Returns)
  async update__S3(
    @Args('input') args: argsDto.UpdateS3Args,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.UpdateS3Returns> {
    const { _id, ...updateData } = args;
    const s3 = await this.s3Repository
      .update(_id, updateData)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: `Failed to update s3 with ID ${args._id}`,
          details: error,
        });
      });
    if (!s3) {
      throw GqlAppException.NotFound({
        message: `S3 with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi cập nhật thành công
      await this.s3SubscriptionResolver.publishOnUpdate__S3({
        data: s3,
        deviceId: deviceId,
      });
    }
    return s3;
  }

  // =================================================================
  // DELETE DEMO (Single Delete)
  // =================================================================
  @Mutation(() => resDto.DeleteS3Returns)
  async delete__S3(
    @Args('input') args: argsDto.DeleteS3Args,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.DeleteS3Returns> {
    const result = await this.s3Repository.delete(args._id).catch((error) => {
      throw GqlAppException.DatabaseError({
        message: `Failed to delete s3 with ID ${args._id}`,
        details: error,
      });
    });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: `S3 with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi xóa thành công
      await this.s3SubscriptionResolver.publishOnDelete__S3({
        id: args._id,
        deviceId: deviceId,
      });
    }
    return result;
  }

  // =================================================================
  // CREATE DEMOS (MULTI INSERT)
  // =================================================================
  @Mutation(() => resDto.CreateS3sReturns)
  async createMany__S3s(
    @Args('input') args: argsDto.CreateS3sArgs,
  ): Promise<resDto.CreateS3sReturns> {
    const result = await this.s3Repository
      .createMany(args.s3s)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to create multiple s3s',
          details: error,
        });
      });
    return result;
  }

  // =================================================================
  // UPDATE DEMOS (MULTI UPDATE)
  // =================================================================
  @Mutation(() => resDto.UpdateS3sReturns)
  async updateMany__S3(
    @Args('input') args: argsDto.UpdateS3sArgs,
  ): Promise<resDto.UpdateS3sReturns> {
    const result = await this.s3Repository
      .updateMany(args.ids, args.data)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to update multiple s3s',
          details: error,
        });
      });
    if (result.matchedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No s3s found with the provided IDs',
      });
    }
    return result;
  }

  // =================================================================
  // DELETE DEMOS (MULTI DELETE)
  // =================================================================
  @Mutation(() => resDto.DeleteS3sReturns)
  async deleteMany__S3(
    @Args('input') args: argsDto.DeleteS3sArgs,
  ): Promise<resDto.DeleteS3sReturns> {
    const result = await this.s3Repository
      .deleteMany(args.ids)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to delete multiple s3s',
          details: error,
        });
      });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No s3s found with the provided IDs',
      });
    }
    return result;
  }
}
