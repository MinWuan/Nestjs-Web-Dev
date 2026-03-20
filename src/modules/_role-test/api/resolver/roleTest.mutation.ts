import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
  Subscription,
} from '@nestjs/graphql';
import { UsePipes } from '@nestjs/common';
import { graphqlValidationPipe } from '@/shared/pipes/validation.pipe';

import { DeviceId } from '@/common/decorator/device-id.decorator';
import { RoleTest } from '../../entity';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { RoleTestRepositoryTypeorm } from '../../repository';
import { RoleTestSubscriptionResolver } from './roleTest.subscription';
import { GqlAppException } from '@/common/exception/GqlAppException';

@Resolver((of) => RoleTest)
@UsePipes(graphqlValidationPipe)
export class RoleTestMutationResolver {
  constructor(
    private roleTestRepository: RoleTestRepositoryTypeorm,
    private roleTestSubscriptionResolver: RoleTestSubscriptionResolver,
  ) {}

  // =================================================================
  // CREATE DEMO (Single Insert)
  // =================================================================
  @Mutation(() => resDto.CreateRoleTestReturns)
  async create__RoleTest(
    @Args('input') args: argsDto.CreateRoleTestArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.CreateRoleTestReturns> {
    const roleTest = await this.roleTestRepository.create(args).catch((error) => {
      throw GqlAppException.DatabaseError({
        message: 'Failed to create roleTest',
        details: error,
      });
    });
    if (deviceId) {
      // Publish sự kiện sau khi tạo thành công
      await this.roleTestSubscriptionResolver.publishOnCreate__RoleTest({
        data: roleTest,
        deviceId: deviceId,
      });
    }
    return roleTest;
  }
  // =================================================================
  // UPDATE DEMO (Single Update)
  // =================================================================
  @Mutation(() => resDto.UpdateRoleTestReturns)
  async update__RoleTest(
    @Args('input') args: argsDto.UpdateRoleTestArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.UpdateRoleTestReturns> {
    const { _id, ...updateData } = args;
    const roleTest = await this.roleTestRepository
      .update(_id, updateData)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: `Failed to update roleTest with ID ${args._id}`,
          details: error,
        });
      });
    if (!roleTest) {
      throw GqlAppException.NotFound({
        message: `RoleTest with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi cập nhật thành công
      await this.roleTestSubscriptionResolver.publishOnUpdate__RoleTest({
        data: roleTest,
        deviceId: deviceId,
      });
    }
    return roleTest;
  }

  // =================================================================
  // DELETE DEMO (Single Delete)
  // =================================================================
  @Mutation(() => resDto.DeleteRoleTestReturns)
  async delete__RoleTest(
    @Args('input') args: argsDto.DeleteRoleTestArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.DeleteRoleTestReturns> {
    const result = await this.roleTestRepository.delete(args._id).catch((error) => {
      throw GqlAppException.DatabaseError({
        message: `Failed to delete roleTest with ID ${args._id}`,
        details: error,
      });
    });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: `RoleTest with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi xóa thành công
      await this.roleTestSubscriptionResolver.publishOnDelete__RoleTest({
        id: args._id,
        deviceId: deviceId,
      });
    }
    return result;
  }

  // =================================================================
  // CREATE DEMOS (MULTI INSERT)
  // =================================================================
  @Mutation(() => resDto.CreateRoleTestsReturns)
  async createMany__RoleTests(
    @Args('input') args: argsDto.CreateRoleTestsArgs,
  ): Promise<resDto.CreateRoleTestsReturns> {
    const result = await this.roleTestRepository
      .createMany(args.roleTests)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to create multiple roleTests',
          details: error,
        });
      });
    return result;
  }

  // =================================================================
  // UPDATE DEMOS (MULTI UPDATE)
  // =================================================================
  @Mutation(() => resDto.UpdateRoleTestsReturns)
  async updateMany__RoleTest(
    @Args('input') args: argsDto.UpdateRoleTestsArgs,
  ): Promise<resDto.UpdateRoleTestsReturns> {
    const result = await this.roleTestRepository
      .updateMany(args.ids, args.data)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to update multiple roleTests',
          details: error,
        });
      });
    if (result.matchedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No roleTests found with the provided IDs',
      });
    }
    return result;
  }

  // =================================================================
  // DELETE DEMOS (MULTI DELETE)
  // =================================================================
  @Mutation(() => resDto.DeleteRoleTestsReturns)
  async deleteMany__RoleTest(
    @Args('input') args: argsDto.DeleteRoleTestsArgs,
  ): Promise<resDto.DeleteRoleTestsReturns> {
    const result = await this.roleTestRepository
      .deleteMany(args.ids)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to delete multiple roleTests',
          details: error,
        });
      });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No roleTests found with the provided IDs',
      });
    }
    return result;
  }
}
