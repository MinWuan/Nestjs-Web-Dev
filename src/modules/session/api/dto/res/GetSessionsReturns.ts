import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Session } from '../../../entity';

@ObjectType()
export class GetSessionsReturns {
  @Field(() => [Session])
  data!: Session[];

  @Field(() => Int, { nullable: true })
  total!: number;

  @Field(() => Int, { nullable: true })
  page!: number;

  @Field(() => Int, { nullable: true })
  limit!: number;
}
