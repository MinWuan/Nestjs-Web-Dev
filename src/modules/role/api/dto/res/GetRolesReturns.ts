import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from '../../../entity';

@ObjectType()
export class GetRolesReturns {
  @Field(() => [Role])
  data!: Role[];

  @Field(() => Int, { nullable: true })
  total!: number;

  @Field(() => Int, { nullable: true })
  page!: number;

  @Field(() => Int, { nullable: true })
  limit!: number;
}
