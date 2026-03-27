import { ObjectType, Field, Int } from '@nestjs/graphql';
import { RankRecord } from '../../../entity';

@ObjectType()
export class CreateRankRecordsReturns {
  @Field(() => [String], { nullable: true })
  ids!: string[];

  @Field(() => Int, { nullable: true })
  count!: number;

  @Field(() => [RankRecord], { nullable: true })
  data!: RankRecord[];
}
