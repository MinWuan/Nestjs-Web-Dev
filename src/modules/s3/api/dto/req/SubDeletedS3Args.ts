import { InputType, Field } from '@nestjs/graphql';
import {} from 'class-validator';
import {} from 'class-transformer';

@InputType()
export class SubDeletedS3Args {
  @Field(() => String)
  deviceId: string;
}
