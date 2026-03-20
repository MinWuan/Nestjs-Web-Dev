import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ArrayMinSize, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/graphql';
import { UpdateRoleArgs } from './UpdateRoleArgs';

@InputType()
class UpdateRoleData extends OmitType(UpdateRoleArgs, ['_id'] as const) {}

@InputType()
export class UpdateRolesArgs {
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  ids: string[];

  @Field(() => UpdateRoleData)
  @ValidateNested()
  @Type(() => UpdateRoleData)
  data: UpdateRoleData;
}
