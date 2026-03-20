import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UpdateDemosReturns {
  @Field(() => Int, { nullable: true })
  modifiedCount: number;

  @Field(() => Int, { nullable: true })
  matchedCount: number;
}
