import { ObjectType, Field } from '@nestjs/graphql';
import { Demo } from '../../../entity';

@ObjectType()
export class SubCreatedDemoReturns {
  @Field(() => Demo, { nullable: true })
  data: Demo;

  @Field(() => String, { nullable: true })
  deviceId: string;
}
