import { InputType, Field } from '@nestjs/graphql';
import {} from 'class-validator';
import {} from 'class-transformer';

@InputType()
export class DeleteS3Args {
  @Field(() => String)
  _id!: string;
}
