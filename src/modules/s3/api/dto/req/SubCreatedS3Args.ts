import { InputType, Field } from '@nestjs/graphql';
import {} from 'class-validator';
import {} from 'class-transformer';

@InputType()
export class SubCreatedS3Args {
  @Field(() => String)
  deviceId: string;
}
