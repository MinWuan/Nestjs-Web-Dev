import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
  Info,
} from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { UsePipes, UseGuards, UseInterceptors } from '@nestjs/common';

import { GqlAppException } from '@/common/exception/GqlAppException';
import { SignatureGuard } from '@/common/guard/signature.guard';
import { AppLogger } from '@/common/logger/app.logger';
import { graphqlValidationPipe } from '@/shared/pipes/validation.pipe';
import { AuthGuard } from '@/common/guard/auth.guard';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { DemoRepositoryTypeorm } from '../../repository';

import { RoleTest } from '@/modules/_role-test';
import { Demo, DemoUserInfo } from '../../entity';
import { RoleTestDataLoaderService } from '@/modules/_role-test/data-loader';
import { getSelectFields } from '@/shared/utils/graphql.util';

@Resolver((of) => Demo) //để khai báo resolver cho Demo schema
@UsePipes(graphqlValidationPipe)
@UseGuards(SignatureGuard)
export class DemoQueryResolver {
  constructor(
    private demoRepository: DemoRepositoryTypeorm,
    private roleTestDataLoader: RoleTestDataLoaderService,
    private logger: AppLogger,
  ) {}

  // =================================================================
  // GET DEMO
  // =================================================================
  @Query(() => Demo)
  async get__Demo(
    @Args('input') args: argsDto.GetDemoArgs,
    @Info() info?: GraphQLResolveInfo,
  ): Promise<Demo> {
    const selectFields = getSelectFields({
      info,
      relations: ['role', 'roles', 'userInfo.role'], // nếu có các trường quan hệ thì thêm vào đây
    });
    //console.log('getDemo Fields: ', selectFields);

    const demo = await this.demoRepository.findById({
      _id: args._id,
      select: selectFields,
    });
    //console.log('Fetched getDemo: ', demo);
    if (!demo) {
      throw GqlAppException.NotFound({
        message: `Demo with ID ${args._id} not found`,
      });
    }
    return demo;
  }

  // =================================================================
  // GET DEMOS
  // =================================================================
  @Query(() => resDto.GetDemosReturns)
  async getMany__Demo(
    @Args('input', { nullable: true }) args?: argsDto.GetDemosArgs,
    @Info() info?: GraphQLResolveInfo,
  ): Promise<resDto.GetDemosReturns> {
    //args ??= {};
    const selectFields = getSelectFields({
      info,
      path: 'data', // vì data là mảng con trả về
      relations: ['role'], // nếu có các trường quan hệ thì thêm vào đây
    });
    //console.loginfo, 'data');
    //console.log('getDemos Fields: ', selectFields);

    const data = await this.demoRepository.findAll({
      page: args?.page,
      limit: args?.limit,
      filters: args?.filters,
      search: args?.search,
      range: args?.range,
      sort: args?.sort,
      select: selectFields,
    });
    //console.log('Fetched demo', data);
    return data;
  }

  // =================================================================
  // Resolve Fields
  // =================================================================
  @ResolveField(() => Demo)
  async role(
    @Parent() demo: Demo,
    @Info() info: GraphQLResolveInfo,
  ): Promise<RoleTest | null> {
    if (!demo.roleId) return null;
    const selectFields = getSelectFields({
      info,
    });

    const role = await this.roleTestDataLoader.roleTestLoader.load({
      id: demo.roleId,
      select: selectFields,
    });
    //console.log('Fetched role:', role);
    return role;
  }

  // =================================================================
  // Resolve Fields
  // =================================================================
  @ResolveField(() => [RoleTest], { nullable: 'itemsAndList' })
  async roles(
    @Parent() demo: Demo,
    @Info() info: GraphQLResolveInfo,
  ): Promise<RoleTest[]> {
    if (!demo.roleIds || demo.roleIds.length === 0) return [];

    const selectFields = getSelectFields({
      info,
    });

    // Sử dụng loadMany để load nhiều roles cùng lúc
    const roles = await this.roleTestDataLoader.roleTestLoader.loadMany(
      demo.roleIds.map((id) => ({
        id,
        select: selectFields,
      })),
    );

    // Filter out errors and null values
    return roles.filter(
      (role): role is RoleTest => role !== null && !(role instanceof Error),
    );
  }
}

@Resolver((of) => DemoUserInfo)
export class DemoUserInfoResolver {
  constructor(private roleTestDataLoader: RoleTestDataLoaderService) {}

  // =================================================================
  // Resolve Fields
  // =================================================================
  @ResolveField(() => RoleTest, { nullable: true })
  async role(
    @Parent() userInfo: DemoUserInfo,
    @Info() info: GraphQLResolveInfo,
  ): Promise<RoleTest | null> {
    //console.log('Resolving role for DemoUserInfo:', userInfo);
    if (!userInfo.roleId) return null;

    const selectFields = getSelectFields({ info });

    const role = await this.roleTestDataLoader.roleTestLoader.load({
      id: userInfo.roleId,
      select: selectFields,
    });
    return role;
  }
}
