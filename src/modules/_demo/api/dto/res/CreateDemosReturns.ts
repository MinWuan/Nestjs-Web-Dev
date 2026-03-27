import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Demo } from '../../../entity';

@ObjectType()
export class CreateDemosReturns {
  @Field(() => [String], { nullable: true })
  ids!: string[];

  @Field(() => Int, { nullable: true })
  count!: number;

  @Field(() => [Demo], { nullable: true })
  data!: Demo[];
}
