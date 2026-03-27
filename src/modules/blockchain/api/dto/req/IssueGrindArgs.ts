import {
  InputType,
  Field,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PeriodTypeEnum } from '../../../entity';

@InputType()
export class IssueGrindArgs {
  @Field(() => String)
  @IsString()
  learnerAddress!: string;

  @Field(() => String)
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  learnerName!: string;

  @Field(() => String)
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  learnerEmail!: string;

  @Field(() => PeriodTypeEnum)
  @IsEnum(PeriodTypeEnum)
  periodType!: PeriodTypeEnum;

  @Field(() => String)
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  periodLabel!: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  studyHours!: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  rank?: number;
}
