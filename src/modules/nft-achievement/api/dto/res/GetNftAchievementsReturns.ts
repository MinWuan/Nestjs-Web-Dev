import { ObjectType, Field, Int } from '@nestjs/graphql';
import { NftAchievement } from '../../../entity';

@ObjectType()
export class GetNftAchievementsReturns {
  @Field(() => [NftAchievement])
  data!: NftAchievement[];

  @Field(() => Int, { nullable: true })
  total!: number;

  @Field(() => Int, { nullable: true })
  page!: number;

  @Field(() => Int, { nullable: true })
  limit!: number;
}
