import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ArrayMinSize, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/graphql';
import { UpdateUserArgs } from './UpdateUserArgs';

@InputType()
class UpdateUserData extends OmitType(UpdateUserArgs, ['_id'] as const) {}

@InputType()
export class UpdateUsersArgs {
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  ids!: string[];

  @Field(() => UpdateUserData)
  @ValidateNested()
  @Type(() => UpdateUserData)
  data!: UpdateUserData;
}
