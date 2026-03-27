import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SubDeletedRoleTestReturns {
  @Field(() => String, { nullable: true })
  id!: string;

  @Field(() => String, { nullable: true })
  deviceId!: string;
}
