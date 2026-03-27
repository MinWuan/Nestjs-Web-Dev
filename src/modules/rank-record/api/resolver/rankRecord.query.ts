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
import { RankRecordRepositoryTypeorm } from '../../repository';

import { RankRecord } from '../../entity';
import { getSelectFields } from '@/shared/utils/graphql.util';

@Resolver((of) => RankRecord) //để khai báo resolver cho RankRecord schema
@UseGuards(SignatureGuard)
export class RankRecordQueryResolver {
  constructor(
    private rankRecordRepository: RankRecordRepositoryTypeorm,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('RankRecordQueryResolver');
  }

  // =================================================================
  // GET DEMO
  // =================================================================
  @Query(() => RankRecord)
  async get__RankRecord(
    @Args('input') args: argsDto.GetRankRecordArgs,
    @Info() info?: GraphQLResolveInfo,
  ): Promise<RankRecord> {
    const selectFields = getSelectFields({
      info,
      relations: ['leaderboard.user'], // nếu có các trường quan hệ thì thêm vào đây
    });
    //console.log('getRankRecord Fields: ', selectFields);

    const rankRecord = await this.rankRecordRepository.findById({
      _id: args._id,
      select: selectFields,
    });
    //console.log('Fetched getRankRecord: ', rankRecord);
    if (!rankRecord) {
      throw GqlAppException.NotFound({
        message: `RankRecord with ID ${args._id} not found`,
      });
    }
    return rankRecord;
  }

  // =================================================================
  // GET DEMOS
  // =================================================================
  @Query(() => resDto.GetRankRecordsReturns)
  async getMany__RankRecord(
    @Args('input', { nullable: true }) args?: argsDto.GetRankRecordsArgs,
    @Info() info?: GraphQLResolveInfo,
  ): Promise<resDto.GetRankRecordsReturns> {
    //args ??= {};
    const selectFields = getSelectFields({
      info,
      path: 'data', // vì data là mảng con trả về
      relations: ['leaderboard.user'], // nếu có các trường quan hệ thì thêm vào đây
    });
    //console.loginfo, 'data');
    //console.log('getRankRecords Fields: ', selectFields);

    const data = await this.rankRecordRepository.findAll({
      page: args?.page,
      limit: args?.limit,
      filters: args?.filters,
      search: args?.search,
      range: args?.range,
      sort: args?.sort,
      select: selectFields,
    });
    //console.log('Fetched rankRecord', data);
    return data;
  }
}
