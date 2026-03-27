import { ObjectType, Field } from '@nestjs/graphql';
import { RoleTest } from '../../../entity';

@ObjectType()
export class SubUpdatedRoleTestReturns {
  @Field(() => RoleTest, { nullable: true })
  data!: RoleTest;

  @Field(() => String, { nullable: true })
  deviceId!: string;
}
