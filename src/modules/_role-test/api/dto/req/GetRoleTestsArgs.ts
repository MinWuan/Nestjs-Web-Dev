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

import { CreateRoleTestArgs } from './CreateRoleTestArgs';

enum GetRoleTestsSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(GetRoleTestsSortOrder, { name: 'GetRoleTestsSortOrder' });

@InputType()
class GetRoleTestsSortInput {
  @Field()
  @IsString()
  field!: string;

  @Field(() => GetRoleTestsSortOrder)
  @IsEnum(GetRoleTestsSortOrder)
  order!: GetRoleTestsSortOrder;
}

@InputType()
class GetRoleTestsSearchInput {
  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  fields!: string[];

  @Field()
  @IsString()
  keyword!: string;
}

@InputType()
class GetRoleTestsRangeConditionInput {
  @Field({ nullable: true })
  @IsOptional()
  from?: Date;

  @Field({ nullable: true })
  @IsOptional()
  to?: Date;
}

@InputType()
export class GetRoleTestsFiltersInput extends PartialType(CreateRoleTestArgs) {}
{
}

@InputType()
export class GetRoleTestsRangeInput {
  @Field(() => GetRoleTestsRangeConditionInput, { nullable: true })
  createdAt?: GetRoleTestsRangeConditionInput;

  @Field(() => GetRoleTestsRangeConditionInput, { nullable: true })
  updatedAt?: GetRoleTestsRangeConditionInput;
}

@InputType()
export class GetRoleTestsArgs {
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
  @Field(() => GetRoleTestsFiltersInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRoleTestsFiltersInput)
  filters?: GetRoleTestsFiltersInput;
  /** search */
  @Field(() => GetRoleTestsSearchInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRoleTestsSearchInput)
  search?: GetRoleTestsSearchInput;
  /** range */
  @Field(() => GetRoleTestsRangeInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRoleTestsRangeInput)
  range?: GetRoleTestsRangeInput;

  /** sort */
  @Field(() => GetRoleTestsSortInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRoleTestsSortInput)
  sort?: GetRoleTestsSortInput;
}
