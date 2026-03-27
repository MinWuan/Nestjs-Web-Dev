import { ObjectType, Field } from '@nestjs/graphql';
import { S3 } from '../../../entity';

@ObjectType()
export class SubUpdatedS3Returns {
  @Field(() => S3, { nullable: true })
  data!: S3;

  @Field(() => String, { nullable: true })
  deviceId!: string;
}
