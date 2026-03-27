import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../../entity';

@ObjectType()
export class SubUpdatedUserReturns {
  @Field(() => User, { nullable: true })
  data!: User;

  @Field(() => String, { nullable: true })
  deviceId!: string;
}
