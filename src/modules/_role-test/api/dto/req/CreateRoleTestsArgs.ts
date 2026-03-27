import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRoleTestArgs } from './CreateRoleTestArgs';

@InputType()
export class CreateRoleTestsArgs {
  @Field(() => [CreateRoleTestArgs])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateRoleTestArgs)
  roleTests!: CreateRoleTestArgs[];
}
