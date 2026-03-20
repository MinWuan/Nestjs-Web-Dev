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

import { CreateS3Args } from './CreateS3Args';

enum GetS3sSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(GetS3sSortOrder, { name: 'GetS3sSortOrder' });

@InputType()
class GetS3sSortInput {
  @Field()
  @IsString()
  field!: string;

  @Field(() => GetS3sSortOrder)
  @IsEnum(GetS3sSortOrder)
  order!: GetS3sSortOrder;
}

@InputType()
class GetS3sSearchInput {
  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  fields!: string[];

  @Field()
  @IsString()
  keyword!: string;
}

@InputType()
class GetS3sRangeConditionInput {
  @Field({ nullable: true })
  @IsOptional()
  from?: Date;

  @Field({ nullable: true })
  @IsOptional()
  to?: Date;
}

@InputType()
export class GetS3sFiltersInput extends PartialType(CreateS3Args) {}
{
}

@InputType()
export class GetS3sRangeInput {
  @Field(() => GetS3sRangeConditionInput, { nullable: true })
  createdAt?: GetS3sRangeConditionInput;

  @Field(() => GetS3sRangeConditionInput, { nullable: true })
  updatedAt?: GetS3sRangeConditionInput;
}

@InputType()
export class GetS3sArgs {
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
  @Field(() => GetS3sFiltersInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetS3sFiltersInput)
  filters?: GetS3sFiltersInput;
  /** search */
  @Field(() => GetS3sSearchInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetS3sSearchInput)
  search?: GetS3sSearchInput;
  /** range */
  @Field(() => GetS3sRangeInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetS3sRangeInput)
  range?: GetS3sRangeInput;

  /** sort */
  @Field(() => GetS3sSortInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetS3sSortInput)
  sort?: GetS3sSortInput;
}
