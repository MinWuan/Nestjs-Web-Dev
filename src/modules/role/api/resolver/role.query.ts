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
import { UseGuards } from '@nestjs/common';

import { GqlAppException } from '@/common/exception/GqlAppException';
import { SignatureGuard } from '@/common/guard/signature.guard';
import { AppLogger } from '@/common/logger/app.logger';
import { AuthGuard } from '@/common/guard/auth.guard';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { RoleRepositoryTypeorm } from '../../repository';

import { Role } from '../../entity';
import { getSelectFields } from '@/shared/utils/graphql.util';

@Resolver((of) => Role) //để khai báo resolver cho Role schema
@UseGuards(SignatureGuard)
export class RoleQueryResolver {
  constructor(
    private roleRepository: RoleRepositoryTypeorm,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('RoleQueryResolver');
  }

  // =================================================================
  // GET DEMO
  // =================================================================
  @Query(() => Role)
  async get__Role(
    @Args('input') args: argsDto.GetRoleArgs,
    @Info() info?: GraphQLResolveInfo,
  ): Promise<Role> {
    const selectFields = getSelectFields({
      info,
      relations: [], // nếu có các trường quan hệ thì thêm vào đây
    });
    //console.log('getRole Fields: ', selectFields);

    const role = await this.roleRepository.findById({
      _id: args._id,
      select: selectFields,
    });
    //console.log('Fetched getRole: ', role);
    if (!role) {
      throw GqlAppException.NotFound({
        message: `Role with ID ${args._id} not found`,
      });
    }
    return role;
  }

  // =================================================================
  // GET DEMOS
  // =================================================================
  @Query(() => resDto.GetRolesReturns)
  async getMany__Role(
    @Args('input', { nullable: true }) args?: argsDto.GetRolesArgs,
    @Info() info?: GraphQLResolveInfo,
  ): Promise<resDto.GetRolesReturns> {
    //args ??= {};
    const selectFields = getSelectFields({
      info,
      path: 'data', // vì data là mảng con trả về
      relations: [], // nếu có các trường quan hệ thì thêm vào đây
    });
    //console.loginfo, 'data');
    //console.log('getRoles Fields: ', selectFields);

    const data = await this.roleRepository.findAll({
      page: args?.page,
      limit: args?.limit,
      filters: args?.filters,
      search: args?.search,
      range: args?.range,
      sort: args?.sort,
      select: selectFields,
    });
    //console.log('Fetched role', data);
    return data;
  }
}
