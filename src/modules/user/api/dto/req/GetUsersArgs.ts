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

import { CreateUserArgs } from './CreateUserArgs';

enum GetUsersSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(GetUsersSortOrder, { name: 'GetUsersSortOrder' });

@InputType()
class GetUsersSortInput {
  @Field()
  @IsString()
  field!: string;

  @Field(() => GetUsersSortOrder)
  @IsEnum(GetUsersSortOrder)
  order!: GetUsersSortOrder;
}

@InputType()
class GetUsersSearchInput {
  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  fields!: string[];

  @Field()
  @IsString()
  keyword!: string;
}

@InputType()
class GetUsersRangeConditionInput {
  @Field({ nullable: true })
  @IsOptional()
  from?: Date;

  @Field({ nullable: true })
  @IsOptional()
  to?: Date;
}

@InputType()
export class GetUsersFiltersInput extends PartialType(CreateUserArgs) {}
{
}

@InputType()
export class GetUsersRangeInput {
  @Field(() => GetUsersRangeConditionInput, { nullable: true })
  createdAt?: GetUsersRangeConditionInput;

  @Field(() => GetUsersRangeConditionInput, { nullable: true })
  updatedAt?: GetUsersRangeConditionInput;
}

@InputType()
export class GetUsersArgs {
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
  @Field(() => GetUsersFiltersInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetUsersFiltersInput)
  filters?: GetUsersFiltersInput;
  /** search */
  @Field(() => GetUsersSearchInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetUsersSearchInput)
  search?: GetUsersSearchInput;
  /** range */
  @Field(() => GetUsersRangeInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetUsersRangeInput)
  range?: GetUsersRangeInput;

  /** sort */
  @Field(() => GetUsersSortInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetUsersSortInput)
  sort?: GetUsersSortInput;
}
