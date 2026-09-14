import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class DeleteNftAchievementReturns {
  @Field(() => Int, { nullable: true })
  deletedCount!: number;

  @Field(() => Boolean, { nullable: true })
  acknowledged!: boolean;
}
