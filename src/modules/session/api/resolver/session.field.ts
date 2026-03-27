import { Resolver, ResolveField, Parent, Info } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { getSelectFields } from '@/shared/utils/graphql.util';
import { AppLogger } from '@/common/logger/app.logger';
import { Session } from '../../entity';
import { User } from '@/modules/user';
import { UserDataLoaderService } from '@/modules/user';

@Resolver((of) => Session)
export class SessionFieldResolver {
  constructor(
    private userDataLoader: UserDataLoaderService,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('SessionFieldResolver');
  }

  @ResolveField(() => User, { nullable: true, name: 'user' })
  async user(
    @Parent() session: Session,
    @Info() info: GraphQLResolveInfo,
  ): Promise<User | null> {
    if (!session.id_user) return null;
    const selectFields = getSelectFields({
      info,
    });
    const user = await this.userDataLoader.userLoader.load({
      id: session.id_user.toString(),
      select: selectFields,
    });
    return user;
  }
}
