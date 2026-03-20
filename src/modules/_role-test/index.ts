import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOMAIN } from '@/common/constants/common';

import { RoleTest } from './entity';

import { RoleTestRepositoryTypeorm } from './repository';
import { RoleTestRepositoryFacade } from './repository/typeorm/facade';
import { RoleTestQueryResolver } from './api/resolver/roleTest.query';
import { RoleTestMutationResolver } from './api/resolver/roleTest.mutation';
import { RoleTestSubscriptionResolver } from './api/resolver/roleTest.subscription';

import { RoleTestDataLoaderService } from './data-loader';
import { RoleTestUseCaseModule } from './use-case';

export { RoleTestRepositoryFacade, RoleTestDataLoaderService, RoleTest };

@Module({
  imports: [TypeOrmModule.forFeature([RoleTest], DOMAIN.test.name)],
  controllers: [],
  providers: [
    //Repository
    RoleTestRepositoryTypeorm,
    RoleTestRepositoryFacade,

    //Resolvers
    RoleTestMutationResolver,
    RoleTestQueryResolver,
    RoleTestSubscriptionResolver,

    //Use Cases
    RoleTestUseCaseModule,

    //DataLoader của các module khác có thể được inject vào đây
    RoleTestDataLoaderService,

    //PubSub for Subscriptions
    {
      provide: PubSub,
      useValue: new PubSub(),
    },
  ],
  exports: [RoleTestRepositoryFacade, RoleTestDataLoaderService],
})
export class RoleTestModule {}
