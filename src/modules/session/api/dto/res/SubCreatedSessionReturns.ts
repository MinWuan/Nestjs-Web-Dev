import { ObjectType, Field } from '@nestjs/graphql';
import { Session } from '../../../entity';

@ObjectType()
export class SubCreatedSessionReturns {
  @Field(() => Session, { nullable: true })
  data!: Session;

  @Field(() => String, { nullable: true })
  deviceId!: string;
}
