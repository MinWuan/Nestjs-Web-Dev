import { ObjectType, Field, Int } from '@nestjs/graphql';
import { S3 } from '../../../entity';

@ObjectType()
export class GetS3sReturns {
  @Field(() => [S3])
  data: S3[];

  @Field(() => Int, { nullable: true })
  total: number;

  @Field(() => Int, { nullable: true })
  page: number;

  @Field(() => Int, { nullable: true })
  limit: number;
}
