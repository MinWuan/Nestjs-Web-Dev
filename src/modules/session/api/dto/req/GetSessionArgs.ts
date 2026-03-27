import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import {} from 'class-transformer';

@InputType()
export class GetSessionArgs {
  @Field(() => String)
  @IsString()
  _id!: string;
}
