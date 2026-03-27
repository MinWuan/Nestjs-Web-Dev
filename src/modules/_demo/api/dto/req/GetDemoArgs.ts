import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import {} from 'class-transformer';

@InputType()
export class GetDemoArgs {
  @Field(() => String)
  @IsString()
  _id!: string;
}
