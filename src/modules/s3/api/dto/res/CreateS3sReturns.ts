import { ObjectType, Field, Int } from '@nestjs/graphql';
import { S3 } from '../../../entity';

@ObjectType()
export class CreateS3sReturns {
  @Field(() => [String], { nullable: true })
  ids!: string[];

  @Field(() => Int, { nullable: true })
  count!: number;

  @Field(() => [S3], { nullable: true })
  data!: S3[];
}
