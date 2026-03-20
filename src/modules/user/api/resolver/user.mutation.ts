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
import { User } from '../../entity';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { UserRepositoryTypeorm } from '../../repository';
import { UserSubscriptionResolver } from './user.subscription';
import { GqlAppException } from '@/common/exception/GqlAppException';

@Resolver((of) => User)
export class UserMutationResolver {
  constructor(
    private userRepository: UserRepositoryTypeorm,
    private userSubscriptionResolver: UserSubscriptionResolver,
  ) {}

  // =================================================================
  // CREATE DEMO (Single Insert)
  // =================================================================
  @Mutation(() => resDto.CreateUserReturns)
  async create__User(
    @Args('input') args: argsDto.CreateUserArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.CreateUserReturns> {
    const user = await this.userRepository.create(args).catch((error) => {
      throw GqlAppException.DatabaseError({
        message: 'Failed to create user',
        details: error,
      });
    });
    if (deviceId) {
      // Publish sự kiện sau khi tạo thành công
      await this.userSubscriptionResolver.publishOnCreate__User({
        data: user,
        deviceId: deviceId,
      });
    }
    return user;
  }
  // =================================================================
  // UPDATE DEMO (Single Update)
  // =================================================================
  @Mutation(() => resDto.UpdateUserReturns)
  async update__User(
    @Args('input') args: argsDto.UpdateUserArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.UpdateUserReturns> {
    const { _id, ...updateData } = args;
    const user = await this.userRepository
      .update(_id, updateData)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: `Failed to update user with ID ${args._id}`,
          details: error,
        });
      });
    if (!user) {
      throw GqlAppException.NotFound({
        message: `User with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi cập nhật thành công
      await this.userSubscriptionResolver.publishOnUpdate__User({
        data: user,
        deviceId: deviceId,
      });
    }
    return user;
  }

  // =================================================================
  // DELETE DEMO (Single Delete)
  // =================================================================
  @Mutation(() => resDto.DeleteUserReturns)
  async delete__User(
    @Args('input') args: argsDto.DeleteUserArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.DeleteUserReturns> {
    const result = await this.userRepository.delete(args._id).catch((error) => {
      throw GqlAppException.DatabaseError({
        message: `Failed to delete user with ID ${args._id}`,
        details: error,
      });
    });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: `User with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi xóa thành công
      await this.userSubscriptionResolver.publishOnDelete__User({
        id: args._id,
        deviceId: deviceId,
      });
    }
    return result;
  }

  // =================================================================
  // CREATE DEMOS (MULTI INSERT)
  // =================================================================
  @Mutation(() => resDto.CreateUsersReturns)
  async createMany__Users(
    @Args('input') args: argsDto.CreateUsersArgs,
  ): Promise<resDto.CreateUsersReturns> {
    const result = await this.userRepository
      .createMany(args.users)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to create multiple users',
          details: error,
        });
      });
    return result;
  }

  // =================================================================
  // UPDATE DEMOS (MULTI UPDATE)
  // =================================================================
  @Mutation(() => resDto.UpdateUsersReturns)
  async updateMany__User(
    @Args('input') args: argsDto.UpdateUsersArgs,
  ): Promise<resDto.UpdateUsersReturns> {
    const result = await this.userRepository
      .updateMany(args.ids, args.data)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to update multiple users',
          details: error,
        });
      });
    if (result.matchedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No users found with the provided IDs',
      });
    }
    return result;
  }

  // =================================================================
  // DELETE DEMOS (MULTI DELETE)
  // =================================================================
  @Mutation(() => resDto.DeleteUsersReturns)
  async deleteMany__User(
    @Args('input') args: argsDto.DeleteUsersArgs,
  ): Promise<resDto.DeleteUsersReturns> {
    const result = await this.userRepository
      .deleteMany(args.ids)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to delete multiple users',
          details: error,
        });
      });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No users found with the provided IDs',
      });
    }
    return result;
  }
}
