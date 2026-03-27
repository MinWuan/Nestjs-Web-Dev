import { InputType, Field } from '@nestjs/graphql';
import {} from 'class-validator';
import {} from 'class-transformer';

@InputType()
export class SubUpdatedUserArgs {
  @Field(() => String)
  deviceId!: string;
}
