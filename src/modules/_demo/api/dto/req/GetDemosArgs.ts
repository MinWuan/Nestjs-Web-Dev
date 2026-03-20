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

import { CreateDemoArgs } from './CreateDemoArgs';

enum GetDemosSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(GetDemosSortOrder, { name: 'GetDemosSortOrder' });

@InputType()
class GetDemosSortInput {
  @Field()
  @IsString()
  field!: string;

  @Field(() => GetDemosSortOrder)
  @IsEnum(GetDemosSortOrder)
  order!: GetDemosSortOrder;
}

@InputType()
class GetDemosSearchInput {
  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  fields!: string[];

  @Field()
  @IsString()
  keyword!: string;
}

@InputType()
class GetDemosRangeConditionInput {
  @Field({ nullable: true })
  @IsOptional()
  from?: Date;

  @Field({ nullable: true })
  @IsOptional()
  to?: Date;
}

@InputType()
export class GetDemosFiltersInput extends PartialType(CreateDemoArgs) {}
{
}

@InputType()
export class GetDemosRangeInput {
  @Field(() => GetDemosRangeConditionInput, { nullable: true })
  createdAt?: GetDemosRangeConditionInput;

  @Field(() => GetDemosRangeConditionInput, { nullable: true })
  updatedAt?: GetDemosRangeConditionInput;
}

@InputType()
export class GetDemosArgs {
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
  @Field(() => GetDemosFiltersInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetDemosFiltersInput)
  filters?: GetDemosFiltersInput;
  /** search */
  @Field(() => GetDemosSearchInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetDemosSearchInput)
  search?: GetDemosSearchInput;
  /** range */
  @Field(() => GetDemosRangeInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetDemosRangeInput)
  range?: GetDemosRangeInput;

  /** sort */
  @Field(() => GetDemosSortInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetDemosSortInput)
  sort?: GetDemosSortInput;
}
