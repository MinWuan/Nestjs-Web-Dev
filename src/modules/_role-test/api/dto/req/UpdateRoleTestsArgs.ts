import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ArrayMinSize, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/graphql';
import { UpdateRoleTestArgs } from './UpdateRoleTestArgs';

@InputType()
class UpdateRoleTestData extends OmitType(UpdateRoleTestArgs, ['_id'] as const) {}

@InputType()
export class UpdateRoleTestsArgs {
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  ids!: string[];

  @Field(() => UpdateRoleTestData)
  @ValidateNested()
  @Type(() => UpdateRoleTestData)
  data!: UpdateRoleTestData;
}
