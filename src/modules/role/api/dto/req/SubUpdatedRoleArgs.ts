import { InputType, Field } from '@nestjs/graphql';
import {} from 'class-validator';
import {} from 'class-transformer';

@InputType()
export class SubUpdatedRoleArgs {
  @Field(() => String)
  deviceId!: string;
}
