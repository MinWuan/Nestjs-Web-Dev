import { ObjectType, Field } from '@nestjs/graphql';
import { Role } from '../../../entity';

@ObjectType()
export class SubUpdatedRoleReturns {
  @Field(() => Role, { nullable: true })
  data: Role;

  @Field(() => String, { nullable: true })
  deviceId: string;
}
