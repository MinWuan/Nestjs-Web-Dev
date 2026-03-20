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
import { Demo } from '../../entity';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { DemoRepositoryTypeorm } from '../../repository';
import { DemoSubscriptionResolver } from './demo.subscription';
import { GqlAppException } from '@/common/exception/GqlAppException';

@Resolver((of) => Demo)
@UsePipes(graphqlValidationPipe)
export class DemoMutationResolver {
  constructor(
    private demoRepository: DemoRepositoryTypeorm,
    private demoSubscriptionResolver: DemoSubscriptionResolver,
  ) {}

  // =================================================================
  // CREATE DEMO (Single Insert)
  // =================================================================
  @Mutation(() => resDto.CreateDemoReturns)
  async create__Demo(
    @Args('input') args: argsDto.CreateDemoArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.CreateDemoReturns> {
    const demo = await this.demoRepository.create(args).catch((error) => {
      throw GqlAppException.DatabaseError({
        message: 'Failed to create demo',
        details: error,
      });
    });
    if (deviceId) {
      // Publish sự kiện sau khi tạo thành công
      await this.demoSubscriptionResolver.publishOnCreate__Demo({
        data: demo,
        deviceId: deviceId,
      });
    }
    return demo;
  }
  // =================================================================
  // UPDATE DEMO (Single Update)
  // =================================================================
  @Mutation(() => resDto.UpdateDemoReturns)
  async update__Demo(
    @Args('input') args: argsDto.UpdateDemoArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.UpdateDemoReturns> {
    const { _id, ...updateData } = args;
    const demo = await this.demoRepository
      .update(_id, updateData)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: `Failed to update demo with ID ${args._id}`,
          details: error,
        });
      });
    if (!demo) {
      throw GqlAppException.NotFound({
        message: `Demo with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi cập nhật thành công
      await this.demoSubscriptionResolver.publishOnUpdate__Demo({
        data: demo,
        deviceId: deviceId,
      });
    }
    return demo;
  }

  // =================================================================
  // DELETE DEMO (Single Delete)
  // =================================================================
  @Mutation(() => resDto.DeleteDemoReturns)
  async delete__Demo(
    @Args('input') args: argsDto.DeleteDemoArgs,
    @DeviceId() deviceId?: string,
  ): Promise<resDto.DeleteDemoReturns> {
    const result = await this.demoRepository.delete(args._id).catch((error) => {
      throw GqlAppException.DatabaseError({
        message: `Failed to delete demo with ID ${args._id}`,
        details: error,
      });
    });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: `Demo with ID ${args._id} not found`,
      });
    }
    if (deviceId) {
      // Publish sự kiện sau khi xóa thành công
      await this.demoSubscriptionResolver.publishOnDelete__Demo({
        id: args._id,
        deviceId: deviceId,
      });
    }
    return result;
  }

  // =================================================================
  // CREATE DEMOS (MULTI INSERT)
  // =================================================================
  @Mutation(() => resDto.CreateDemosReturns)
  async createMany__Demos(
    @Args('input') args: argsDto.CreateDemosArgs,
  ): Promise<resDto.CreateDemosReturns> {
    const result = await this.demoRepository
      .createMany(args.demos)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to create multiple demos',
          details: error,
        });
      });
    return result;
  }

  // =================================================================
  // UPDATE DEMOS (MULTI UPDATE)
  // =================================================================
  @Mutation(() => resDto.UpdateDemosReturns)
  async updateMany__Demo(
    @Args('input') args: argsDto.UpdateDemosArgs,
  ): Promise<resDto.UpdateDemosReturns> {
    const result = await this.demoRepository
      .updateMany(args.ids, args.data)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to update multiple demos',
          details: error,
        });
      });
    if (result.matchedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No demos found with the provided IDs',
      });
    }
    return result;
  }

  // =================================================================
  // DELETE DEMOS (MULTI DELETE)
  // =================================================================
  @Mutation(() => resDto.DeleteDemosReturns)
  async deleteMany__Demo(
    @Args('input') args: argsDto.DeleteDemosArgs,
  ): Promise<resDto.DeleteDemosReturns> {
    const result = await this.demoRepository
      .deleteMany(args.ids)
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to delete multiple demos',
          details: error,
        });
      });
    if (result.deletedCount === 0) {
      throw GqlAppException.NotFound({
        message: 'No demos found with the provided IDs',
      });
    }
    return result;
  }
}
