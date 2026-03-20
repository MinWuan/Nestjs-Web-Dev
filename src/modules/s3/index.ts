import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOMAIN } from '@/common/constants/common';

import { S3 } from './entity';

import { S3RepositoryTypeorm } from './repository';
import { S3RepositoryFacade } from './repository/typeorm/facade';
import { S3QueryResolver } from './api/resolver/s3.query';
import { S3MutationResolver } from './api/resolver/s3.mutation';
import { S3SubscriptionResolver } from './api/resolver/s3.subscription';
import { S3FieldResolver } from './api/resolver/s3.field';

import { S3DataLoaderService } from './data-loader';
import { S3UseCaseModule } from './use-case';

import { UserModule } from '@/modules/user';

export { S3RepositoryFacade, S3DataLoaderService, S3 };

@Module({
  imports: [TypeOrmModule.forFeature([S3], DOMAIN.main.name), UserModule],
  controllers: [],
  providers: [
    //Repository
    S3RepositoryTypeorm,
    S3RepositoryFacade,

    //Resolvers
    S3MutationResolver,
    S3QueryResolver,
    S3SubscriptionResolver,
    S3FieldResolver,

    //Use Cases
    S3UseCaseModule,

    //DataLoader của các module khác có thể được inject vào đây
    S3DataLoaderService,

    //PubSub for Subscriptions
    {
      provide: PubSub,
      useValue: new PubSub(),
    },
  ],
  exports: [S3RepositoryFacade, S3DataLoaderService],
})
export class S3Module {}
