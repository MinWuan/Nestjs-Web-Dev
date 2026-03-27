import { ObjectType, Field, Int } from '@nestjs/graphql';
import { RoleTest } from '../../../entity';

@ObjectType()
export class CreateRoleTestsReturns {
  @Field(() => [String], { nullable: true })
  ids!: string[];

  @Field(() => Int, { nullable: true })
  count!: number;

  @Field(() => [RoleTest], { nullable: true })
  data!: RoleTest[];
}
