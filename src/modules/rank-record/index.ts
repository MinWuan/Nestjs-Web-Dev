import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOMAIN } from '@/common/constants/common';

import { RankRecord, TotalUptimeStatusEnum } from './entity';

import { RankRecordRepositoryTypeorm } from './repository';
import { RankRecordRepositoryFacade } from './repository/typeorm/facade';
import { RankRecordQueryResolver } from './api/resolver/rankRecord.query';
import { RankRecordMutationResolver } from './api/resolver/rankRecord.mutation';
import { RankRecordSubscriptionResolver } from './api/resolver/rankRecord.subscription';
import { RankRecordFieldResolver } from './api/resolver/rankRecord.field';
import { LeaderboardRankRecordFieldResolver } from './api/resolver/leaderboardRankRecord.field';

import { RankRecordDataLoaderService } from './data-loader';
import { RankRecordUseCaseModule } from './use-case';
import { UserModule } from '@/modules/user';
import { MilestoneReachedEvent } from './event-handler';
import { RankRecordEventHandler } from './event-handler/rankRecord.event';
export {
  RankRecordRepositoryFacade,
  RankRecordDataLoaderService,
  TotalUptimeStatusEnum,
  RankRecord,
  MilestoneReachedEvent,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([RankRecord], DOMAIN.main.name),
    UserModule,
  ],
  controllers: [],
  providers: [
    //Repository
    RankRecordRepositoryTypeorm,
    RankRecordRepositoryFacade,

    //Resolvers
    RankRecordMutationResolver,
    RankRecordQueryResolver,
    RankRecordSubscriptionResolver,
    RankRecordFieldResolver,
    LeaderboardRankRecordFieldResolver,

    //Event Handlers
    RankRecordEventHandler,

    //Use Cases
    RankRecordUseCaseModule,

    //DataLoader của các module khác có thể được inject vào đây
    RankRecordDataLoaderService,

    //PubSub for Subscriptions
    {
      provide: PubSub,
      useValue: new PubSub(),
    },
  ],
  exports: [RankRecordRepositoryFacade, RankRecordDataLoaderService],
})
export class RankRecordModule {}
