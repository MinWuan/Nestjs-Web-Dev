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
import { Role } from '../../entity';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { RoleRepositoryTypeorm } from '../../repository';
import { RoleSubscriptionResolver } from './role.subscription';
import { GqlAppException } from '@/common/exception/GqlAppException';
import { AppLogger } from '@/common/logger/app.logger';

@Resolver((of) => Role)
export class RoleMutationResolver {
  constructor(
    private roleRepository: RoleRepositoryTypeorm,
    private roleSubscriptionResolver: RoleSubscriptionResolver,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('RoleMutationResolver');
  }

  // =================================================================
  // CREATE DEMO (Single Insert)
  // =================================================================
  @Mutation(() => resDto.CreateRoleReturns)
  async create__Role(
    @Args('input') args: argsDto.CreateRoleArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.CreateRoleReturns> {
    const role = await this.roleRepository.create(args).catch((error) => {
      throw GqlAppException.DatabaseError({
        message: 'Failed to create role',
        details: error,
      });
    });
    if (deviceId) {
      // Publish sự kiện sau khi tạo thành công
      await this.roleSubscriptionResolver.publishOnCreate__Role({
        data: role,
        deviceId: deviceId,
      });
    }
    return role;
  }
  // =================================================================
  // UPDATE DEMO (Single Update)
  // =================================================================
  @Mutation(() => resDto.UpdateRoleReturns)
  async update__Role(
    @Args('input') args: argsDto.UpdateRoleArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.UpdateRoleReturns> {
    const { _id, ...updateData } = args;
    const role = await this.roleRepository
      .update(_id, updateData)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: `Failed to update role with ID ${args._id}`,
          details: error,
        });
      });
    if (!role) {
      throw GqlAppException.NotFound({
        message: `Role with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi cập nhật thành công
      await this.roleSubscriptionResolver.publishOnUpdate__Role({
        data: role,
        deviceId: deviceId,
      });
    }
    return role;
  }

  // =================================================================
  // DELETE DEMO (Single Delete)
  // =================================================================
  @Mutation(() => resDto.DeleteRoleReturns)
  async delete__Role(
    @Args('input') args: argsDto.DeleteRoleArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.DeleteRoleReturns> {
    const result = await this.roleRepository.delete(args._id).catch((error) => {
      throw GqlAppException.DatabaseError({
        message: `Failed to delete role with ID ${args._id}`,
        details: error,
      });
    });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: `Role with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi xóa thành công
      await this.roleSubscriptionResolver.publishOnDelete__Role({
        id: args._id,
        deviceId: deviceId,
      });
    }
    return result;
  }

  // =================================================================
  // CREATE DEMOS (MULTI INSERT)
  // =================================================================
  @Mutation(() => resDto.CreateRolesReturns)
  async createMany__Roles(
    @Args('input') args: argsDto.CreateRolesArgs,
  ): Promise<resDto.CreateRolesReturns> {
    const result = await this.roleRepository
      .createMany(args.roles)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to create multiple roles',
          details: error,
        });
      });
    return result;
  }

  // =================================================================
  // UPDATE DEMOS (MULTI UPDATE)
  // =================================================================
  @Mutation(() => resDto.UpdateRolesReturns)
  async updateMany__Role(
    @Args('input') args: argsDto.UpdateRolesArgs,
  ): Promise<resDto.UpdateRolesReturns> {
    const result = await this.roleRepository
      .updateMany(args.ids, args.data)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to update multiple roles',
          details: error,
        });
      });
    if (result.matchedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No roles found with the provided IDs',
      });
    }
    return result;
  }

  // =================================================================
  // DELETE DEMOS (MULTI DELETE)
  // =================================================================
  @Mutation(() => resDto.DeleteRolesReturns)
  async deleteMany__Role(
    @Args('input') args: argsDto.DeleteRolesArgs,
  ): Promise<resDto.DeleteRolesReturns> {
    const result = await this.roleRepository
      .deleteMany(args.ids)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to delete multiple roles',
          details: error,
        });
      });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No roles found with the provided IDs',
      });
    }
    return result;
  }
}
