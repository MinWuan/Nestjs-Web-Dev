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

import { CreateSessionArgs } from './CreateSessionArgs';

enum GetSessionsSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(GetSessionsSortOrder, { name: 'GetSessionsSortOrder' });

@InputType()
class GetSessionsSortInput {
  @Field()
  @IsString()
  field!: string;

  @Field(() => GetSessionsSortOrder)
  @IsEnum(GetSessionsSortOrder)
  order!: GetSessionsSortOrder;
}

@InputType()
class GetSessionsSearchInput {
  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  fields!: string[];

  @Field()
  @IsString()
  keyword!: string;
}

@InputType()
class GetSessionsRangeConditionInput {
  @Field({ nullable: true })
  @IsOptional()
  from?: Date;

  @Field({ nullable: true })
  @IsOptional()
  to?: Date;
}

@InputType()
export class GetSessionsFiltersInput extends PartialType(CreateSessionArgs) {}
{
}

@InputType()
export class GetSessionsRangeInput {
  @Field(() => GetSessionsRangeConditionInput, { nullable: true })
  createdAt?: GetSessionsRangeConditionInput;

  @Field(() => GetSessionsRangeConditionInput, { nullable: true })
  updatedAt?: GetSessionsRangeConditionInput;
}

@InputType()
export class GetSessionsArgs {
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
  @Field(() => GetSessionsFiltersInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetSessionsFiltersInput)
  filters?: GetSessionsFiltersInput;
  /** search */
  @Field(() => GetSessionsSearchInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetSessionsSearchInput)
  search?: GetSessionsSearchInput;
  /** range */
  @Field(() => GetSessionsRangeInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetSessionsRangeInput)
  range?: GetSessionsRangeInput;

  /** sort */
  @Field(() => GetSessionsSortInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetSessionsSortInput)
  sort?: GetSessionsSortInput;
}
