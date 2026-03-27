import { ObjectType, Field, Int } from '@nestjs/graphql';
import { RoleTest } from '../../../entity';

@ObjectType()
export class GetRoleTestsReturns {
  @Field(() => [RoleTest])
  data!: RoleTest[];

  @Field(() => Int, { nullable: true })
  total!: number;

  @Field(() => Int, { nullable: true })
  page!: number;

  @Field(() => Int, { nullable: true })
  limit!: number;
}
