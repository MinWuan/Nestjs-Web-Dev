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

import { CreateRankRecordArgs } from './CreateRankRecordArgs';

enum GetRankRecordsSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(GetRankRecordsSortOrder, { name: 'GetRankRecordsSortOrder' });

@InputType()
class GetRankRecordsSortInput {
  @Field()
  @IsString()
  field!: string;

  @Field(() => GetRankRecordsSortOrder)
  @IsEnum(GetRankRecordsSortOrder)
  order!: GetRankRecordsSortOrder;
}

@InputType()
class GetRankRecordsSearchInput {
  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  fields!: string[];

  @Field()
  @IsString()
  keyword!: string;
}

@InputType()
class GetRankRecordsRangeConditionInput {
  @Field({ nullable: true })
  @IsOptional()
  from?: Date;

  @Field({ nullable: true })
  @IsOptional()
  to?: Date;
}

@InputType()
export class GetRankRecordsFiltersInput extends PartialType(CreateRankRecordArgs) {}
{
}

@InputType()
export class GetRankRecordsRangeInput {
  @Field(() => GetRankRecordsRangeConditionInput, { nullable: true })
  createdAt?: GetRankRecordsRangeConditionInput;

  @Field(() => GetRankRecordsRangeConditionInput, { nullable: true })
  updatedAt?: GetRankRecordsRangeConditionInput;
}

@InputType()
export class GetRankRecordsArgs {
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
  @Field(() => GetRankRecordsFiltersInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRankRecordsFiltersInput)
  filters?: GetRankRecordsFiltersInput;
  /** search */
  @Field(() => GetRankRecordsSearchInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRankRecordsSearchInput)
  search?: GetRankRecordsSearchInput;
  /** range */
  @Field(() => GetRankRecordsRangeInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRankRecordsRangeInput)
  range?: GetRankRecordsRangeInput;

  /** sort */
  @Field(() => GetRankRecordsSortInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRankRecordsSortInput)
  sort?: GetRankRecordsSortInput;
}
