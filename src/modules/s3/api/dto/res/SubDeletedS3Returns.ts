import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SubDeletedS3Returns {
  @Field(() => String, { nullable: true })
  id!: string;

  @Field(() => String, { nullable: true })
  deviceId!: string;
}
