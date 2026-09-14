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

import { CreateNftAchievementArgs } from './CreateNftAchievementArgs';

enum GetNftAchievementsSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(GetNftAchievementsSortOrder, { name: 'GetNftAchievementsSortOrder' });

@InputType()
class GetNftAchievementsSortInput {
  @Field()
  @IsString()
  field!: string;

  @Field(() => GetNftAchievementsSortOrder)
  @IsEnum(GetNftAchievementsSortOrder)
  order!: GetNftAchievementsSortOrder;
}

@InputType()
class GetNftAchievementsSearchInput {
  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  fields!: string[];

  @Field()
  @IsString()
  keyword!: string;
}

@InputType()
class GetNftAchievementsRangeConditionInput {
  @Field({ nullable: true })
  @IsOptional()
  from?: Date;

  @Field({ nullable: true })
  @IsOptional()
  to?: Date;
}

@InputType()
export class GetNftAchievementsFiltersInput extends PartialType(CreateNftAchievementArgs) {}
{
}

@InputType()
export class GetNftAchievementsRangeInput {
  @Field(() => GetNftAchievementsRangeConditionInput, { nullable: true })
  createdAt?: GetNftAchievementsRangeConditionInput;

  @Field(() => GetNftAchievementsRangeConditionInput, { nullable: true })
  updatedAt?: GetNftAchievementsRangeConditionInput;
}

@InputType()
export class GetNftAchievementsArgs {
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
  @Field(() => GetNftAchievementsFiltersInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetNftAchievementsFiltersInput)
  filters?: GetNftAchievementsFiltersInput;
  /** search */
  @Field(() => GetNftAchievementsSearchInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetNftAchievementsSearchInput)
  search?: GetNftAchievementsSearchInput;
  /** range */
  @Field(() => GetNftAchievementsRangeInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetNftAchievementsRangeInput)
  range?: GetNftAchievementsRangeInput;

  /** sort */
  @Field(() => GetNftAchievementsSortInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetNftAchievementsSortInput)
  sort?: GetNftAchievementsSortInput;
}
