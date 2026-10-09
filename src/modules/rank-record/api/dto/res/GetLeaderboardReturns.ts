import { ObjectType, Field, Int } from '@nestjs/graphql';
import { RankRecord, LeaderboardRankRecord } from '../../../entity';

@ObjectType()
export class GetLeaderboardReturns {
  @Field(() => RankRecord)
  data!: RankRecord;
}
