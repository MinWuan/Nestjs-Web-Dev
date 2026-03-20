import { Resolver, ResolveField, Parent, Info } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { getSelectFields } from '@/shared/utils/graphql.util';
import { AppLogger } from '@/common/logger/app.logger';
import { S3 } from '../../entity';
import { User } from '@/modules/user';
import { UserDataLoaderService } from '@/modules/user';

@Resolver((of) => S3) //để khai báo resolver cho User schema
export class S3FieldResolver {
  constructor(
    private userDataLoader: UserDataLoaderService,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('S3FieldResolver');
  }
   // =================================================================
  // RESOLVE FIELD 
  // =================================================================
  @ResolveField(() => User, { nullable: true, name: 'author' })
  async author(
    @Parent() s3: S3,
    @Info() info: GraphQLResolveInfo,
  ): Promise<User | null> {
    if (!s3.authorId) return null;
    const selectFields = getSelectFields({
      info,
    });
    const user = await this.userDataLoader.userLoader.load({
      id: s3.authorId.toString(),
      select: selectFields,
    });
    return user;
  }
}

