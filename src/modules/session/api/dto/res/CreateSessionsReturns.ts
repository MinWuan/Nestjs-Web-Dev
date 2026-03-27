import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Session } from '../../../entity';

@ObjectType()
export class CreateSessionsReturns {
  @Field(() => [String], { nullable: true })
  ids!: string[];

  @Field(() => Int, { nullable: true })
  count!: number;

  @Field(() => [Session], { nullable: true })
  data!: Session[];
}
