import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOMAIN } from '@/common/constants/common';

import { NftAchievement } from './entity';
import { BlockchainModule } from '@/modules/blockchain';

import { NftAchievementRepositoryTypeorm } from './repository';
import { NftAchievementRepositoryFacade } from './repository/typeorm/facade';
import { NftAchievementQueryResolver } from './api/resolver/nftAchievement.query';
import { NftAchievementMutationResolver } from './api/resolver/nftAchievement.mutation';
import { NftAchievementSubscriptionResolver } from './api/resolver/nftAchievement.subscription';
import { NftAchievementFieldResolver } from './api/resolver/nftAchievement.field';
import { NftAchievementEventHandler } from './event-handler/nftAchievement.event';  
import { NftAchievementDataLoaderService } from './data-loader';

export { NftAchievementRepositoryFacade, NftAchievementDataLoaderService, NftAchievement };

@Module({
  imports: [
    TypeOrmModule.forFeature([NftAchievement], DOMAIN.main.name),
    BlockchainModule,
  ],
  controllers: [],
  providers: [
    //Repository
    NftAchievementRepositoryTypeorm,
    NftAchievementRepositoryFacade,

    //Resolvers
    NftAchievementMutationResolver,
    NftAchievementQueryResolver,
    NftAchievementSubscriptionResolver,
    NftAchievementFieldResolver,

    //Event Handlers
    NftAchievementEventHandler,

    //Use Cases

    //DataLoader của các module khác có thể được inject vào đây
    NftAchievementDataLoaderService,

    //PubSub for Subscriptions
    {
      provide: PubSub,
      useValue: new PubSub(),
    },
  ],
  exports: [NftAchievementRepositoryFacade, NftAchievementDataLoaderService],
})
export class NftAchievementModule {}
