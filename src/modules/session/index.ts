import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOMAIN } from '@/common/constants/common';

import { Session } from './entity';

import { SessionRepositoryTypeorm } from './repository';
import { SessionRepositoryFacade } from './repository/typeorm/facade';
import { SessionQueryResolver } from './api/resolver/session.query';
import { SessionMutationResolver } from './api/resolver/session.mutation';
import { SessionSubscriptionResolver } from './api/resolver/session.subscription';
import { SessionFieldResolver } from './api/resolver/session.field';

import { SessionDataLoaderService } from './data-loader';
import { SessionUseCaseModule } from './use-case';

import { UserModule } from '@/modules/user';

export { SessionRepositoryFacade, SessionDataLoaderService, Session };

@Module({
  imports: [
    TypeOrmModule.forFeature([Session], DOMAIN.main.name),
    UserModule,
  ],
  controllers: [],
  providers: [
    //Repository
    SessionRepositoryTypeorm,
    SessionRepositoryFacade,

    //Resolvers
    SessionMutationResolver,
    SessionQueryResolver,
    SessionSubscriptionResolver,
    SessionFieldResolver,

    //Use Cases
    SessionUseCaseModule,

    //DataLoader của các module khác có thể được inject vào đây
    SessionDataLoaderService,

    //PubSub for Subscriptions
    {
      provide: PubSub,
      useValue: new PubSub(),
    },
  ],
  exports: [SessionRepositoryFacade, SessionDataLoaderService],
})
export class SessionModule {}
