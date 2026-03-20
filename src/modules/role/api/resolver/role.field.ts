import { Resolver, ResolveField, Parent, Info } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { getSelectFields } from '@/shared/utils/graphql.util';
import { AppLogger } from '@/common/logger/app.logger';
import { Role } from '../../entity';

@Resolver((of) => Role) //để khai báo resolver cho User schema
export class RoleFieldResolver {
  constructor(private logger: AppLogger) {
    this.logger.setPrefix('RoleFieldResolver');
  }
   // =================================================================
  // RESOLVE FIELD 
  // =================================================================
}
