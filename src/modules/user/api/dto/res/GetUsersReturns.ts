import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../../entity';

@ObjectType()
export class GetUsersReturns {
  @Field(() => [User])
  data: User[];

  @Field(() => Int, { nullable: true })
  total: number;

  @Field(() => Int, { nullable: true })
  page: number;

  @Field(() => Int, { nullable: true })
  limit: number;
}
