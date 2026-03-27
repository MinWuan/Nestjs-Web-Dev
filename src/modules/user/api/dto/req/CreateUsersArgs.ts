import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserArgs } from './CreateUserArgs';

@InputType()
export class CreateUsersArgs {
  @Field(() => [CreateUserArgs])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateUserArgs)
  users!: CreateUserArgs[];
}
