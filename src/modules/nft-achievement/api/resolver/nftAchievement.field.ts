import { Resolver, ResolveField, Parent, Info } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { getSelectFields } from '@/shared/utils/graphql.util';
import { AppLogger } from '@/common/logger/app.logger';
import { NftAchievement } from '../../entity';

@Resolver((of) => NftAchievement) //để khai báo resolver cho User schema
export class NftAchievementFieldResolver {
  constructor(private logger: AppLogger) {
    this.logger.setPrefix('NftAchievementFieldResolver');
  }
   // =================================================================
  // RESOLVE FIELD 
  // =================================================================
}
