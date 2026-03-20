import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOMAIN } from '@/common/constants/common';

import { Demo } from './entity';

import { DemoRepositoryTypeorm } from './repository';
import { DemoRepositoryFacade } from './repository/typeorm/facade';
import { DemoQueryResolver } from './api/resolver/demo.query';
import { DemoMutationResolver } from './api/resolver/demo.mutation';
import { DemoSubscriptionResolver } from './api/resolver/demo.subscription';
import { DemoUserInfoResolver } from './api/resolver/demo.query';

import { DemoDataLoaderService } from './data-loader';
import { RoleTestModule } from '../_role-test';
import { DemoUseCaseModule } from './use-case';

export { DemoRepositoryFacade, DemoDataLoaderService, Demo };

@Module({
  imports: [
    TypeOrmModule.forFeature([Demo], DOMAIN.test.name),
    RoleTestModule,
  ],
  controllers: [],
  providers: [
    //Repository
    DemoRepositoryTypeorm,
    DemoRepositoryFacade,

    //Resolvers
    DemoMutationResolver,
    DemoQueryResolver,
    DemoSubscriptionResolver,
    DemoUserInfoResolver,

    //Use Cases
    DemoUseCaseModule,

    //DataLoader của các module khác có thể được inject vào đây
    DemoDataLoaderService,

    //PubSub for Subscriptions
    {
      provide: PubSub,
      useValue: new PubSub(),
    },
  ],
  exports: [DemoRepositoryFacade, DemoDataLoaderService],
})
export class DemoModule {}
