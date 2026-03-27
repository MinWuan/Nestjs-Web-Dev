import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../../entity';

@ObjectType()
export class CreateUsersReturns {
  @Field(() => [String], { nullable: true })
  ids!: string[];

  @Field(() => Int, { nullable: true })
  count!: number;

  @Field(() => [User], { nullable: true })
  data!: User[];
}
