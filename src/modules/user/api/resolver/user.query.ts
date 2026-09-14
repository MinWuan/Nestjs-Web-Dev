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
import { AuthAll,Auth } from '@/common/decorator/auth.decorator';
import { AuthData } from '@/common/decorator/auth-data.decorator';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { UserRepositoryTypeorm } from '../../repository';

import { User } from '../../entity';
import { getSelectFields } from '@/shared/utils/graphql.util';

@Resolver((of) => User) //để khai báo resolver cho User schema
@UseGuards(SignatureGuard)
export class UserQueryResolver {
  constructor(
    private userRepository: UserRepositoryTypeorm,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('UserQueryResolver');
  }

  // =================================================================
  // GET DEMO
  // =================================================================
  @Query(() => User)
  async get__User(
    @Args('input') args: argsDto.GetUserArgs,
    @Info() info?: GraphQLResolveInfo,
  ): Promise<User> {
    const selectFields = getSelectFields({
      info,
      relations: ['role'], // nếu có các trường quan hệ thì thêm vào đây
    });
    //console.log('getUser Fields: ', selectFields);

    const user = await this.userRepository.findById({
      _id: args._id,
      select: selectFields,
    });
    //console.log('Fetched getUser: ', user);
    if (!user) {
      throw GqlAppException.NotFound({
        message: `User with ID ${args._id} not found`,
      });
    }
    return user;
  }

  // =================================================================
  // GET DEMO
  // =================================================================
  @Query(() => User)
  @AuthAll()
  async getInfo__User(
    @Args('input') args: argsDto.GetInfoUserArgs,
    @Info() info?: GraphQLResolveInfo,
    @AuthData() authData?: AuthPayload,
  ): Promise<User> {
    const selectFields = getSelectFields({
      info,
      relations: ['role'], // nếu có các trường quan hệ thì thêm vào đây
    });
    if (!authData?.user?._id) {
      throw GqlAppException.Unauthorized({
        message: 'Unauthorized',
      });
    }
    //console.log('getUser Fields: ', selectFields);

    const user = await this.userRepository.findById({
      _id: authData?.user?._id,
      select: selectFields,
    });
    //console.log('Fetched getUser: ', user);
    if (!user) {
      throw GqlAppException.NotFound({
        message: `User with ID ${authData?.user?._id} not found`,
      });
    }
    return user;
  }

  // =================================================================
  // GET DEMOS
  // =================================================================
  @Query(() => resDto.GetUsersReturns)
  async getMany__User(
    @Args('input', { nullable: true }) args?: argsDto.GetUsersArgs,
    @Info() info?: GraphQLResolveInfo,
  ): Promise<resDto.GetUsersReturns> {
    //args ??= {};
    const selectFields = getSelectFields({
      info,
      path: 'data', // vì data là mảng con trả về
      relations: ['role'], // nếu có các trường quan hệ thì thêm vào đây
    });
    //console.loginfo, 'data');
    //console.log('getUsers Fields: ', selectFields);

    const data = await this.userRepository.findAll({
      page: args?.page,
      limit: args?.limit,
      filters: args?.filters,
      search: args?.search,
      range: args?.range,
      sort: args?.sort,
      select: selectFields,
    });
    //console.log('Fetched user', data);
    return data;
  }
}
