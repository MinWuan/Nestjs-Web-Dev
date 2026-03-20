import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOMAIN } from '@/common/constants/common';

import { User } from './entity';

import { UserRepositoryTypeorm } from './repository';
import { UserRepositoryFacade } from './repository/typeorm/facade';
import { UserQueryResolver } from './api/resolver/user.query';
import { UserMutationResolver } from './api/resolver/user.mutation';
import { UserSubscriptionResolver } from './api/resolver/user.subscription';
import { UserFieldResolver } from './api/resolver/user.field';

import { UserDataLoaderService } from './data-loader';
import { UserUseCaseModule } from './use-case';
import { RoleModule } from '@/modules/role';

export { UserRepositoryFacade, UserDataLoaderService, User };

@Module({
  imports: [TypeOrmModule.forFeature([User], DOMAIN.main.name), RoleModule],
  controllers: [],
  providers: [
    //Repository
    UserRepositoryTypeorm,
    UserRepositoryFacade,

    //Resolvers
    UserMutationResolver,
    UserQueryResolver,
    UserSubscriptionResolver,
    UserFieldResolver,

    //Use Cases
    UserUseCaseModule,

    //DataLoader của các module khác có thể được inject vào đây
    UserDataLoaderService,

    //PubSub for Subscriptions
    {
      provide: PubSub,
      useValue: new PubSub(),
    },
  ],
  exports: [UserRepositoryFacade, UserDataLoaderService],
})
export class UserModule {}
