import {
  InputType,
  Field,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  ValidateNested,
  IsIn,
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

import { CreateRoleArgs } from './CreateRoleArgs';

enum GetRolesSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(GetRolesSortOrder, { name: 'GetRolesSortOrder' });

@InputType()
class GetRolesSortInput {
  @Field()
  @IsString()
  field!: string;

  @Field(() => GetRolesSortOrder)
  @IsEnum(GetRolesSortOrder)
  order!: GetRolesSortOrder;
}

@InputType()
class GetRolesSearchInput {
  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  fields!: string[];

  @Field()
  @IsString()
  keyword!: string;
}

@InputType()
class GetRolesRangeConditionInput {
  @Field({ nullable: true })
  @IsOptional()
  from?: Date;

  @Field({ nullable: true })
  @IsOptional()
  to?: Date;
}

@InputType()
export class GetRolesFiltersInput extends PartialType(CreateRoleArgs) {}
{
}

@InputType()
export class GetRolesRangeInput {
  @Field(() => GetRolesRangeConditionInput, { nullable: true })
  createdAt?: GetRolesRangeConditionInput;

  @Field(() => GetRolesRangeConditionInput, { nullable: true })
  updatedAt?: GetRolesRangeConditionInput;
}

@InputType()
export class GetRolesArgs {
  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  /** filter field = value */
  @Field(() => GetRolesFiltersInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRolesFiltersInput)
  filters?: GetRolesFiltersInput;
  /** search */
  @Field(() => GetRolesSearchInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRolesSearchInput)
  search?: GetRolesSearchInput;
  /** range */
  @Field(() => GetRolesRangeInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRolesRangeInput)
  range?: GetRolesRangeInput;

  /** sort */
  @Field(() => GetRolesSortInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRolesSortInput)
  sort?: GetRolesSortInput;
}
