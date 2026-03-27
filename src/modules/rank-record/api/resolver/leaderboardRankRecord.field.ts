import { Resolver, ResolveField, Parent, Info } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { AppLogger } from '@/common/logger/app.logger';
import { User, UserDataLoaderService } from '@/modules/user';
import { LeaderboardRankRecord } from '../../entity';
import { getSelectFields } from '@/shared/utils/graphql.util';

@Resolver(() => LeaderboardRankRecord)
export class LeaderboardRankRecordFieldResolver {
  constructor(
    private userDataLoader: UserDataLoaderService,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('LeaderboardRankRecordFieldResolver');
  }

  @ResolveField(() => User, { nullable: true, name: 'user' })
  async user(
    @Parent() leaderboard: LeaderboardRankRecord,
    @Info() info: GraphQLResolveInfo,
  ): Promise<User | null> {
    if (!leaderboard.userId) return null;
    const selectFields = getSelectFields({
      info,
    });
    const user = await this.userDataLoader.userLoader.load({
      id: leaderboard.userId.toString(),
      select: selectFields,
    });
    return user;
  }
}
