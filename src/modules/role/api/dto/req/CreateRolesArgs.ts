import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRoleArgs } from './CreateRoleArgs';

@InputType()
export class CreateRolesArgs {
  @Field(() => [CreateRoleArgs])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateRoleArgs)
  roles: CreateRoleArgs[];
}
