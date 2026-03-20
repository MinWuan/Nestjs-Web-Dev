import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOMAIN } from '@/common/constants/common';

import { Role } from './entity';

import { RoleRepositoryTypeorm } from './repository';
import { RoleRepositoryFacade } from './repository/typeorm/facade';
import { RoleQueryResolver } from './api/resolver/role.query';
import { RoleMutationResolver } from './api/resolver/role.mutation';
import { RoleSubscriptionResolver } from './api/resolver/role.subscription';
import { RoleFieldResolver } from './api/resolver/role.field';

import { RoleDataLoaderService } from './data-loader';
import { RoleUseCaseModule } from './use-case';

export { RoleRepositoryFacade, RoleDataLoaderService, Role };

@Module({
  imports: [TypeOrmModule.forFeature([Role], DOMAIN.main.name)],
  controllers: [],
  providers: [
    //Repository
    RoleRepositoryTypeorm,
    RoleRepositoryFacade,

    //Resolvers
    RoleMutationResolver,
    RoleQueryResolver,
    RoleSubscriptionResolver,
    RoleFieldResolver,

    //Use Cases
    RoleUseCaseModule,

    //DataLoader của các module khác có thể được inject vào đây
    RoleDataLoaderService,

    //PubSub for Subscriptions
    {
      provide: PubSub,
      useValue: new PubSub(),
    },
  ],
  exports: [RoleRepositoryFacade, RoleDataLoaderService],
})
export class RoleModule {}
