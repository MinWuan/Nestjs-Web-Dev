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
import { S3RepositoryTypeorm } from '../../repository';

import { S3 } from '../../entity';
import { getSelectFields } from '@/shared/utils/graphql.util';

@Resolver((of) => S3) //để khai báo resolver cho S3 schema
@UseGuards(SignatureGuard)
export class S3QueryResolver {
  constructor(
    private s3Repository: S3RepositoryTypeorm,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('S3QueryResolver');
  }

  // =================================================================
  // GET DEMO
  // =================================================================
  @Query(() => S3)
  async get__S3(
    @Args('input') args: argsDto.GetS3Args,
    @Info() info?: GraphQLResolveInfo,
  ): Promise<S3> {
    const selectFields = getSelectFields({
      info,
      relations: ['author'], // nếu có các trường quan hệ thì thêm vào đây
    });
    //console.log('getS3 Fields: ', selectFields);

    const s3 = await this.s3Repository.findById({
      _id: args._id,
      select: selectFields,
    });
    //console.log('Fetched getS3: ', s3);
    if (!s3) {
      throw GqlAppException.NotFound({
        message: `S3 with ID ${args._id} not found`,
      });
    }
    return s3;
  }

  // =================================================================
  // GET DEMOS
  // =================================================================
  @Query(() => resDto.GetS3sReturns)
  async getMany__S3(
    @Args('input', { nullable: true }) args?: argsDto.GetS3sArgs,
    @Info() info?: GraphQLResolveInfo,
  ): Promise<resDto.GetS3sReturns> {
    //args ??= {};
    const selectFields = getSelectFields({
      info,
      path: 'data', // vì data là mảng con trả về
      relations: ['author'], // nếu có các trường quan hệ thì thêm vào đây
    });
    //console.loginfo, 'data');
    //console.log('getS3s Fields: ', selectFields);

    const data = await this.s3Repository.findAll({
      page: args?.page,
      limit: args?.limit,
      filters: args?.filters,
      search: args?.search,
      range: args?.range,
      sort: args?.sort,
      select: selectFields,
    });
    //console.log('Fetched s3', data);
    return data;
  }
}
