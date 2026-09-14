import { ObjectType, Field, Int } from '@nestjs/graphql';
import { NftAchievement } from '../../../entity';

@ObjectType()
export class CreateNftAchievementsReturns {
  @Field(() => [String], { nullable: true })
  ids!: string[];

  @Field(() => Int, { nullable: true })
  count!: number;

  @Field(() => [NftAchievement], { nullable: true })
  data!: NftAchievement[];
}
