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
import { SessionRepositoryTypeorm } from '../../repository';
import { AuthAll, Auth } from '@/common/decorator/auth.decorator';
import { AuthData } from '@/common/decorator/auth-data.decorator';

import { Session } from '../../entity';
import { getSelectFields } from '@/shared/utils/graphql.util';
import { ClsService } from 'nestjs-cls';

@Resolver((of) => Session) //để khai báo resolver cho Session schema
@UseGuards(SignatureGuard)
export class SessionQueryResolver {
  constructor(
    private sessionRepository: SessionRepositoryTypeorm,
    private logger: AppLogger,
    private clsService: ClsService,
  ) {
    this.logger.setPrefix('SessionQueryResolver');
  }

  // =================================================================
  // GET DEMO
  // =================================================================
  @Query(() => Session)
  async get__Session(
    @Args('input') args: argsDto.GetSessionArgs,
    @Info() info?: GraphQLResolveInfo,
  ): Promise<Session> {
    const selectFields = getSelectFields({
      info,
      relations: ['user'],
    });
    //console.log('getSession Fields: ', selectFields);

    const session = await this.sessionRepository.findById({
      _id: args._id,
      select: selectFields,
    });
    //console.log('Fetched getSession: ', session);
    if (!session) {
      throw GqlAppException.NotFound({
        message: `Session with ID ${args._id} not found`,
      });
    }
    return session;
  }

  // =================================================================
  // GET DEMOS
  // =================================================================
  @Query(() => resDto.GetSessionsReturns)
  @Auth(["ADMIN"])
  async getMany__Session(
    @Args('input', { nullable: true }) args?: argsDto.GetSessionsArgs,
    @Info() info?: GraphQLResolveInfo,
    @AuthData() authData?: AuthPayload,
  ): Promise<resDto.GetSessionsReturns> {
    //args ??= {};
    //console.log('auth-data', authData);
    // const auth = this.clsService.get<AuthPayload>('auth');
    // console.log('clsService auth:', auth);

    const selectFields = getSelectFields({
      info,
      path: 'data',
      relations: ['user'],
    });
    //console.loginfo, 'data');
    //console.log('getSessions Fields: ', selectFields);

    const data = await this.sessionRepository.findAll({
      page: args?.page,
      limit: args?.limit,
      filters: args?.filters,
      search: args?.search,
      range: args?.range,
      sort: args?.sort,
      select: selectFields,
    });
    //console.log('Fetched session', data);
    return data;
  }
}
