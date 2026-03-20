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
import { RoleTestRepositoryTypeorm } from '../../repository';

import { RoleTest } from '../../entity';
import { getSelectFields } from '@/shared/utils/graphql.util';

@Resolver((of) => RoleTest) //để khai báo resolver cho RoleTest schema
@UsePipes(graphqlValidationPipe)
@UseGuards(SignatureGuard)
export class RoleTestQueryResolver {
  constructor(
    private roleTestRepository: RoleTestRepositoryTypeorm,
    private logger: AppLogger,
  ) {}

  // =================================================================
  // GET DEMO
  // =================================================================
  @Query(() => RoleTest)
  async get__RoleTest(
    @Args('input') args: argsDto.GetRoleTestArgs,
    @Info() info?: GraphQLResolveInfo,
  ): Promise<RoleTest> {
    const selectFields = getSelectFields({
      info,
      relations: [], // nếu có các trường quan hệ thì thêm vào đây
    });
    //console.log('getRoleTest Fields: ', selectFields);

    const roleTest = await this.roleTestRepository.findById({
      _id: args._id,
      select: selectFields,
    });
    //console.log('Fetched getRoleTest: ', roleTest);
    if (!roleTest) {
      throw GqlAppException.NotFound({
        message: `RoleTest with ID ${args._id} not found`,
      });
    }
    return roleTest;
  }

  // =================================================================
  // GET DEMOS
  // =================================================================
  @Query(() => resDto.GetRoleTestsReturns)
  async getMany__RoleTest(
    @Args('input', { nullable: true }) args?: argsDto.GetRoleTestsArgs,
    @Info() info?: GraphQLResolveInfo,
  ): Promise<resDto.GetRoleTestsReturns> {
    //args ??= {};
    const selectFields = getSelectFields({
      info,
      path: 'data', // vì data là mảng con trả về
      relations: [], // nếu có các trường quan hệ thì thêm vào đây
    });
    //console.loginfo, 'data');
    //console.log('getRoleTests Fields: ', selectFields);

    const data = await this.roleTestRepository.findAll({
      page: args?.page,
      limit: args?.limit,
      filters: args?.filters,
      search: args?.search,
      range: args?.range,
      sort: args?.sort,
      select: selectFields,
    });
    //console.log('Fetched roleTest', data);
    return data;
  }
}
