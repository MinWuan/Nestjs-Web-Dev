import { ObjectType, Field, Int } from '@nestjs/graphql';
import { RankRecord } from '../../../entity';

@ObjectType()
export class GetRankRecordsReturns {
  @Field(() => [RankRecord])
  data!: RankRecord[];

  @Field(() => Int, { nullable: true })
  total!: number;

  @Field(() => Int, { nullable: true })
  page!: number;

  @Field(() => Int, { nullable: true })
  limit!: number;
}
