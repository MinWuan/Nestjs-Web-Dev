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
import { NftAchievementRepositoryTypeorm } from '../../repository';

import { NftAchievement } from '../../entity';
import { getSelectFields } from '@/shared/utils/graphql.util';

@Resolver((of) => NftAchievement) //để khai báo resolver cho NftAchievement schema
@UseGuards(SignatureGuard)
export class NftAchievementQueryResolver {
  constructor(
    private nftAchievementRepository: NftAchievementRepositoryTypeorm,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('NftAchievementQueryResolver');
  }

  // =================================================================
  // GET DEMO
  // =================================================================
  @Query(() => NftAchievement)
  async get__NftAchievement(
    @Args('input') args: argsDto.GetNftAchievementArgs,
    @Info() info?: GraphQLResolveInfo,
  ): Promise<NftAchievement> {
    const selectFields = getSelectFields({
      info,
      relations: [], // nếu có các trường quan hệ thì thêm vào đây
    });
    //console.log('getNftAchievement Fields: ', selectFields);

    const nftAchievement = await this.nftAchievementRepository.findById({
      _id: args._id,
      select: selectFields,
    }).catch((error) => {
      throw GqlAppException.DatabaseError({
        message: `Failed to get nftAchievement with ID ${args._id}`,
        details: error,
      });
    });
    //console.log('Fetched getNftAchievement: ', nftAchievement);
    if (!nftAchievement) {
      throw GqlAppException.NotFound({
        message: `NftAchievement with ID ${args._id} not found`,
      });
    }
    return nftAchievement;
  }

  // =================================================================
  // GET DEMOS
  // =================================================================
  @Query(() => resDto.GetNftAchievementsReturns)
  async getMany__NftAchievement(
    @Args('input', { nullable: true }) args?: argsDto.GetNftAchievementsArgs,
    @Info() info?: GraphQLResolveInfo,
  ): Promise<resDto.GetNftAchievementsReturns> {
    //args ??= {};
    const selectFields = getSelectFields({
      info,
      path: 'data', // vì data là mảng con trả về
      relations: [], // nếu có các trường quan hệ thì thêm vào đây
    });
    //console.loginfo, 'data');
    //console.log('getNftAchievements Fields: ', selectFields);

    const data = await this.nftAchievementRepository
      .findAll({
        page: args?.page,
        limit: args?.limit,
        filters: args?.filters,
        search: args?.search,
        range: args?.range,
        sort: args?.sort,
        select: selectFields,
      })
      .catch((error) => {
        throw GqlAppException.DatabaseError({
          message: 'Failed to get many nftAchievements',
          details: error,
        });
      });
    //console.log('Fetched nftAchievement', data);
    return data;
  }
}
