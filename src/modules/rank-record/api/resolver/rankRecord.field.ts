import { Resolver, ResolveField, Parent, Info } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { getSelectFields } from '@/shared/utils/graphql.util';
import { AppLogger } from '@/common/logger/app.logger';
import { RankRecord } from '../../entity';

@Resolver((of) => RankRecord) //để khai báo resolver cho User schema
export class RankRecordFieldResolver {
  constructor(private logger: AppLogger) {
    this.logger.setPrefix('RankRecordFieldResolver');
  }
   // =================================================================
  // RESOLVE FIELD 
  // =================================================================
}
