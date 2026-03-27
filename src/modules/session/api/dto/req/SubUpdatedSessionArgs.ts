import { InputType, Field } from '@nestjs/graphql';
import {} from 'class-validator';
import {} from 'class-transformer';

@InputType()
export class SubUpdatedSessionArgs {
  @Field(() => String)
  deviceId!: string;
}
