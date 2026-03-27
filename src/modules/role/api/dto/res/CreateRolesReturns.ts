import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from '../../../entity';

@ObjectType()
export class CreateRolesReturns {
  @Field(() => [String], { nullable: true })
  ids!: string[];

  @Field(() => Int, { nullable: true })
  count!: number;

  @Field(() => [Role], { nullable: true })
  data!: Role[];
}
