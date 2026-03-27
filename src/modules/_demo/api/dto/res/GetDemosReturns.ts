import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Demo } from '../../../entity';

@ObjectType()
export class GetDemosReturns {
  @Field(() => [Demo])
  data!: Demo[];

  @Field(() => Int, { nullable: true })
  total!: number;

  @Field(() => Int, { nullable: true })
  page!: number;

  @Field(() => Int, { nullable: true })
  limit!: number;
}
