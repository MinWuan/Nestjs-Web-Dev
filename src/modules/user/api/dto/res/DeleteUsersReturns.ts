import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class DeleteUsersReturns {
  @Field(() => Int, { nullable: true })
  deletedCount!: number;

  @Field(() => Boolean, { nullable: true })
  acknowledged!: boolean;
}
