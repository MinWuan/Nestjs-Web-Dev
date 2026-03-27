import {
  InputType,
  Field,
  Int,
} from '@nestjs/graphql';
import {
  IsString,
  IsEmail,
  IsInt,
  IsDateString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class IssueUnbrokenArgs {
  @Field(() => String)
  @IsString()
  learnerAddress!: string;

  @Field(() => String)
  @IsString()
  @Transform(({ value }) => value?.trim())
  learnerName!: string;

  @Field(() => String)
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  learnerEmail!: string;

  @Field(() => String)
  @IsDateString()
  startDate!: string;

  @Field(() => String)
  @IsDateString()
  endDate!: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  streakDays!: number;
}
