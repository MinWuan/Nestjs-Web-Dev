import { Resolver, ResolveField, Parent, Info } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { User } from '../../entity';
import { getSelectFields } from '@/shared/utils/graphql.util';
import { Role } from '@/modules/role';
import { RoleDataLoaderService } from '@/modules/role';
import { AppLogger } from '@/common/logger/app.logger';

@Resolver((of) => User) //để khai báo resolver cho User schema
export class UserFieldResolver {
  constructor(private roleDataLoader: RoleDataLoaderService,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('UserFieldResolver');
  }
  @ResolveField(() => Role, { nullable: true, name: 'role' })
  async role(
    @Parent() user: User,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Role | null> {
    if (!user.id_role) return null;
    const selectFields = getSelectFields({
      info,
    });
    const role = await this.roleDataLoader.roleLoader.load({
      id: user.id_role.toString(),
      select: selectFields,
    });
    return role;
  }
}
